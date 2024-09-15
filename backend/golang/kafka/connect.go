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

// KafkaConsumeSetup creates consumer groups and assigns workers to partitions
func KafkaConsumeSetup(ctx context.Context, errChan chan<- error, groupCount int) {
	var wg sync.WaitGroup

	// Create groups and assign workers
	for groupID := 1; groupID <= groupCount; groupID++ {
		group := fmt.Sprintf(config.Envs.KAFKA_GROUP_ID+"-%d", groupID)
		log.Info().Msgf("Starting consumer group: %s", group)

		for _, topic := range topics {
			for workerID := 1; workerID <= workersPerTopic; workerID++ {
				wg.Add(1)
				go func(topic string, workerID int) {
					defer wg.Done()
					workerName := fmt.Sprintf("%s-%s-worker-%d", group, topic, workerID)
					log.Info().Msgf("Starting worker: %s", workerName)
					if err := consumeWithRetry(ctx, group, topic, workerName); err != nil {
						errChan <- err
					}
				}(topic, workerID)
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
		if err := consumeMessages(ctx, group, topic, workerName); err != nil {
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
			log.Info().Msgf("Shutting down %s", workerName)
			return nil
		default:
			msg, err := r.FetchMessage(ctx)
			if err != nil {
				return err
			}

			// Process the message
			processMessage(msg, workerName)

			// Commit message offset after processing
			if err := r.CommitMessages(ctx, msg); err != nil {
				log.Error().Err(err).Msgf("Failed to commit message in %s", workerName)
			}
		}
	}
}

// processMessage processes individual Kafka messages
func processMessage(msg kafka.Message, workerName string) {
	log.Info().
		Str("worker", workerName).
		Int("partition", msg.Partition).
		Msgf("Received message: %s", string(msg.Value))

	// Process message based on topic
	switch msg.Topic {
	case "message":
		handleMessageTopic(msg.Value)
	case "gpMessage":
		handleGpMessageTopic(msg.Value)
	case "unseenCount":
		handleUnseenCountTopic(msg.Value)
	default:
		log.Warn().Msgf("Unknown topic: %s, value: %s", msg.Topic, string(msg.Value))
	}
}

// handleMessageTopic processes the "message" topic
func handleMessageTopic(message []byte) {
	log.Info().Msgf("Handled 'message' topic with data: %s", string(message))
}

// handleGpMessageTopic processes the "gpMessage" topic
func handleGpMessageTopic(message []byte) {
	log.Info().Msgf("Handled 'gpMessage' topic with data: %s", string(message))
}

// handleUnseenCountTopic processes the "unseenCount" topic
func handleUnseenCountTopic(message []byte) {
	log.Info().Msgf("Handled 'unseenCount' topic with data: %s", string(message))
}
