package kafka

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/nvj9singhnavjot/talkverse-server-kafka/config"
	"github.com/rs/zerolog/log"
	"github.com/segmentio/kafka-go"
)

// Topics to consume
var topics = []string{"message", "gpMessage", "unseenCount"}

// Retry settings
const retryAttempts = 5
const backoff = 2 * time.Second

// Number of workers per topic in each group
// currently for each top 2 workers, this can be increased as per system resources
const workersPerTopic = 2

// WorkerTracker keeps track of workers per topic
type WorkerTracker struct {
	workerCount map[string]int
	mu          sync.Mutex
}

// WorkerError to pass the topic and error
type WorkerError struct {
	Topic      string
	Err        error
	WorkerName string
}

// NewWorkerTracker initializes the worker tracker with the total worker count per topic
func NewWorkerTracker(groupCount int, workersPerGroup int) *WorkerTracker {
	workerCount := make(map[string]int)

	// Initialize worker count per topic (groupsCount * workersPerGroup)
	for _, topic := range topics {
		workerCount[topic] = groupCount * workersPerGroup
	}

	return &WorkerTracker{
		workerCount: workerCount,
	}
}

// DecrementWorker reduces the worker count for a topic and returns the remaining workers for that topic
func (w *WorkerTracker) DecrementWorker(topic string) int {
	w.mu.Lock()
	defer w.mu.Unlock()

	if count, exists := w.workerCount[topic]; exists && count > 0 {
		w.workerCount[topic]--
	}

	return w.workerCount[topic]
}

// KafkaConsumeSetup creates consumer groups and assigns workers to partitions
func KafkaConsumeSetup(ctx context.Context, errChan chan<- WorkerError, groupCount int, wg *sync.WaitGroup) {

	// Create groups and assign workers
	for groupID := 1; groupID <= groupCount; groupID++ {
		groupName := fmt.Sprintf(config.Envs.KAFKA_GROUP_ID+"-%d", groupID)
		log.Info().Msgf("Starting consumer group: %s", groupName)

		// INFO: short notation talkverse-kafka-group-1 -> tk-g-1
		shortGroupName := fmt.Sprintf("tk-g-%d", groupID)

		for _, topic := range topics {
			for workerID := 1; workerID <= workersPerTopic; workerID++ {
				wg.Add(1)
				go func(group string, topic string, workerID int) {
					defer wg.Done()
					// INFO: workerName = tk-g-1-message-worker-1
					workerName := fmt.Sprintf("%s-%s-worker-%d", group, topic, workerID)
					log.Info().Msgf("Starting worker: %s", workerName)
					if err := consumeWithRetry(ctx, group, topic, workerName); err != nil {
						errChan <- WorkerError{Topic: topic, Err: err, WorkerName: workerName}
					}
					log.Warn().Msgf("Shutting down worker: %s", workerName)
				}(shortGroupName, topic, workerID)
			}
		}
	}

	// Wait for all workers to finish
	wg.Wait()
	close(errChan)
}

// consumeWithRetry consumes messages and retries on failure
func consumeWithRetry(ctx context.Context, group, topic, workerName string) error {
	for attempt := 1; attempt <= retryAttempts; attempt++ {
		err := consumeMessages(ctx, group, topic, workerName)

		if err != nil && !errors.Is(err, context.Canceled) {
			log.Error().Err(err).Msgf("Error in %s, retrying (%d/%d)", workerName, attempt, retryAttempts)
			time.Sleep(backoff)
		} else {
			return nil // Successfully consumed
		}
	}
	return errors.New("retries exhausted for consuming message")
}

// consumeMessages connects and consumes messages from Kafka for a given topic
func consumeMessages(ctx context.Context, group, topic, workerName string) error {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{config.Envs.KAFKA_BROKERS},
		GroupID: group,
		Topic:   topic,
		Dialer: &kafka.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 5 * time.Minute,
		},
		HeartbeatInterval: 3 * time.Second,
		MaxAttempts:       retryAttempts,
	})

	defer r.Close()

	for {
		select {
		case <-ctx.Done():
			log.Info().Msgf("Context cancelled, shutting down %s", workerName)
			return nil
		default:
			msg, err := r.FetchMessage(ctx)
			if err != nil {
				return err
			}

			// Process the message
			ProcessMessage(msg, workerName)

			// Commit message offset after processing
			if err := r.CommitMessages(ctx, msg); err != nil {
				log.Error().Err(err).Msgf("Failed to commit message in %s", workerName)
			}
		}
	}
}
