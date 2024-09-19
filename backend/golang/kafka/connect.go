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

// WorkerError to pass the topic and error
type WorkerError struct {
	Topic      string
	Err        error
	WorkerName string
}

// WorkerTracker keeps track of workers per topic and total workers
type WorkerTracker struct {
	workerCount map[string]int
	mu          sync.Mutex
}

// NewWorkerTracker initializes the worker tracker with the total worker count per topic
func NewWorkerTracker(workersPerGroup int) *WorkerTracker {
	workerCount := make(map[string]int)

	// Initialize worker count per topic (workersPerGroup is workers per topic)
	for _, topic := range topics {
		workerCount[topic] = workersPerGroup
	}

	return &WorkerTracker{
		workerCount: workerCount,
	}
}

// DecrementWorker reduces the worker count for a topic and the total worker count,
// returning the remaining workers for that topic and a flag indicating if all workers are stopped.
func (w *WorkerTracker) DecrementWorker(topic string) int {
	w.mu.Lock()
	defer w.mu.Unlock()

	// Decrease the worker count for the specific topic
	if count, exists := w.workerCount[topic]; exists && count > 0 {
		w.workerCount[topic]--
	}

	// Check if all workers are stopped by looking at the global count
	return w.workerCount[topic]
}

// CheckKafkaConnection checks kafka running or not config.Envs.KAFKA_BROKERS
func CheckKafkaConnection() error {
	// Create a new dialer
	dialer := &kafka.Dialer{
		Timeout:   10 * time.Second, // Timeout for dialing the broker
		KeepAlive: 5 * time.Minute,  // Keep connection alive duration
	}

	// Dial the broker to check the connection
	conn, err := dialer.DialContext(context.Background(), "tcp", config.Envs.KAFKA_BROKERS)
	if err != nil {
		return err
	}
	defer conn.Close()

	// If connection is successful
	return nil
}

// KafkaConsumeSetup creates a single consumer group per topic and assigns workers within that group
func KafkaConsumeSetup(ctx context.Context, errChan chan<- WorkerError, workersPerTopic int, wg *sync.WaitGroup) {
	// Iterate over each topic to create one group per topic and spawn workers
	for _, topic := range topics {
		// Create a single consumer group for each topic
		groupName := fmt.Sprintf(config.Envs.KAFKA_GROUP_ID+"-%s-group", topic)
		log.Info().Msgf("Starting consumer group: %s for topic: %s", groupName, topic)

		// INFO: short notation talkverse-kafka-message-group -> tk-message-g
		shortGroupName := fmt.Sprintf("tk-%s-g", topic)

		// Create workers for the current group and topic
		for workerID := 1; workerID <= workersPerTopic; workerID++ {
			wg.Add(1)
			go func(group string, topic string, workerID int) {
				defer wg.Done()
				// INFO: workerName = tk-message-g-worker-1
				workerName := fmt.Sprintf("%s-worker-%d", group, workerID)
				log.Info().Msgf("Starting worker: %s", workerName)
				if err := consumeWithRetry(ctx, group, topic, workerName); err != nil {
					errChan <- WorkerError{Topic: topic, Err: err, WorkerName: workerName}
				}
				log.Warn().Msgf("Shutting down worker: %s", workerName)
			}(shortGroupName, topic, workerID)
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

// consumeMessages connects to Kafka and starts consuming messages for a specific topic with groupId.
//
// NOTE: This function initialize a worker to handle message consumption.
func consumeMessages(ctx context.Context, group, topic, workerName string) error {
	// Create a new Kafka reader (consumer) with specified configuration, including brokers, group ID, and topic.
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{config.Envs.KAFKA_BROKERS}, // Kafka brokers are retrieved from the environment config.
		GroupID: group,                               // Consumer group ID for message sharing across workers.
		Topic:   topic,                               // Topic from which messages will be consumed.
		Dialer: &kafka.Dialer{
			Timeout:   10 * time.Second, // Dial timeout for connecting to Kafka.
			KeepAlive: 5 * time.Minute,  // Keep connection alive for 5 minutes.
		},
		HeartbeatInterval: 3 * time.Second, // Interval for sending heartbeats to maintain the consumer group.
		MaxAttempts:       retryAttempts,   // Maximum number of retry attempts on failures.
	})

	// Ensure the Kafka reader is closed properly when the function exits.
	defer r.Close()

	// Start an infinite loop to continuously fetch and process messages.
	for {
		select {
		case <-ctx.Done():
			// If the context is canceled (e.g., due to shutdown), log and exit the loop.
			log.Info().Msgf("Context cancelled, shutting down %s", workerName)
			return nil
		default:
			// Fetch a new message from the Kafka topic.
			msg, err := r.FetchMessage(ctx)
			if err != nil {
				return err // Return the error if fetching the message fails.
			}

			// Process the fetched message.
			ProcessMessage(msg, workerName)

			// After processing, commit the message offset to Kafka to mark it as consumed.
			if err := r.CommitMessages(ctx, msg); err != nil {
				log.Error().Err(err).Msgf("Failed to commit message in %s", workerName) // Log the error if commit fails.
			}
		}
	}
}
