package kafka

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/config"
	"github.com/rs/zerolog/log"
	"github.com/segmentio/kafka-go"
)

// Topics to consume from Kafka.
var topics = []string{"message", "gpMessage", "unseenCount"}

// Retry settings for consuming Kafka messages.
const retryAttempts = 5
const backoff = 2 * time.Second

// WorkerError struct holds details of the error that occurred while processing a message.
// It includes the topic, the error itself, and the worker name.
type WorkerError struct {
	Topic      string
	Err        error
	WorkerName string
}

// workerTracker struct is used to track the number of workers per topic.
// It ensures thread-safe access to the worker counts using a mutex.
type workerTracker struct {
	workerCount map[string]int
	mu          sync.Mutex
}

// NewWorkerTracker initializes and returns a new workerTracker instance.
// It assigns the number of workers per group (per topic) specified by the user.
func NewWorkerTracker(workersPerGroup int) *workerTracker {
	workerCount := make(map[string]int)

	// Loop through each topic and assign the number of workers for that topic.
	for _, topic := range topics {
		workerCount[topic] = workersPerGroup
	}

	return &workerTracker{
		workerCount: workerCount,
	}
}

// DecrementWorker decreases the worker count for a given topic and returns the remaining workers for that topic.
// It ensures thread-safety using a mutex.
func (w *workerTracker) DecrementWorker(topic string) int {
	w.mu.Lock()
	defer w.mu.Unlock()

	// Check if the topic exists and reduce the worker count if greater than 0.
	if count, exists := w.workerCount[topic]; exists && count > 0 {
		w.workerCount[topic]--
	}

	// Return the remaining worker count for the specified topic.
	return w.workerCount[topic]
}

// KafkaConsumeSetup sets up Kafka consumers by creating one consumer group per topic and assigning workers to each group.
// It spawns a set of workers for each topic to handle message consumption concurrently.
func KafkaConsumeSetup(ctx context.Context, errChan chan<- WorkerError, workersPerTopic int, wg *sync.WaitGroup) {
	// Iterate over the list of topics to create consumer groups and workers for each.
	for _, topic := range topics {

		// Generate the Kafka consumer group name dynamically based on the topic.
		groupName := fmt.Sprintf(config.Envs.KAFKA_GROUP_PREFIX_ID+"-%s-group", topic)
		log.Info().
			Str("topic", topic).
			Str("group", groupName).
			Int("workersCount", workersPerTopic).
			Msg("Starting consumer group")

		// Create a set of workers to consume messages from the current topic.
		for workerID := 1; workerID <= workersPerTopic; workerID++ {
			wg.Add(1)
			go func(group string, topic string, workerID int) {
				defer wg.Done()
				// Generate a unique worker name based on the group and worker ID.
				workerName := fmt.Sprintf("%s-worker-%d", group, workerID)

				log.Info().
					Str("topic", topic).
					Str("worker", workerName).
					Msg("Starting worker")

				// Attempt to consume messages with retries in case of errors.
				if err := consumeWithRetry(ctx, group, topic, workerName); err != nil {
					errChan <- WorkerError{Topic: topic, Err: err, WorkerName: workerName}
				}
				log.Warn().
					Str("topic", topic).
					Str("worker", workerName).
					Msg("Shutting down worker")
			}(groupName, topic, workerID)
		}
	}

	// Wait for all workers to finish their tasks before closing the error channel.
	wg.Wait()
	log.Info().Msg("All workers have completed processing")

	log.Info().Msg("Closing Worker error channel")
	// Close the error channel after all workers are done processing messages.
	close(errChan)
}

// consumeWithRetry attempts to consume Kafka messages for a specific topic with retry logic.
// It retries the operation up to the defined number of attempts in case of failure.
func consumeWithRetry(ctx context.Context, group, topic, workerName string) error {
	for attempt := 1; attempt <= retryAttempts; attempt++ {
		err := consumeKafkaTopic(ctx, group, topic, workerName)

		// Retry if the error is not due to context cancellation.
		if err != nil && !errors.Is(err, context.Canceled) {
			log.Error().
				Err(err).
				Str("topic", topic).
				Str("worker", workerName).
				Str("attempt", fmt.Sprintf("%d/%d", attempt, retryAttempts)).
				Msg("Error during message consumption, retrying")
			time.Sleep(backoff)
		} else {
			// Log successful message consumption and return.
			log.Info().
				Str("topic", topic).
				Str("worker", workerName).
				Msg("Successfully consumed messages")
			return nil // Exit loop on success.
		}
	}
	return errors.New("retries exhausted for consuming") // Return error after retry attempts are exhausted.
}

// consumeKafkaTopic connects to Kafka and consumes messages from the specified topic using the provided group ID.
// It continuously fetches and processes messages until the context is canceled.
func consumeKafkaTopic(ctx context.Context, group, topic, workerName string) error {
	// Create a new Kafka reader for the topic, specifying brokers and consumer group details.
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: config.Envs.KAFKA_BROKERS, // Retrieve Kafka brokers from the environment configuration.
		GroupID: group,                     // Assign the consumer group ID for coordinated consumption.
		Topic:   topic,                     // Specify the topic to consume from.
		Dialer: &kafka.Dialer{
			Timeout:   10 * time.Second, // Timeout for Kafka connection attempts.
			KeepAlive: 5 * time.Minute,  // Keep the connection alive for 5 minutes.
		},
		HeartbeatInterval: 3 * time.Second, // Interval for sending heartbeats to Kafka brokers.
		MaxAttempts:       retryAttempts,   // Maximum number of attempts to consume a message.
	})

	// Ensure the Kafka reader is closed properly when the function exits.
	defer func() {
		if err := r.Close(); err != nil {
			log.Error().Err(err).Msgf("Failed to close Kafka reader for %s", workerName)
		}
	}()

	// Infinite loop to continuously consume messages from the Kafka topic.
	for {
		select {
		case <-ctx.Done():
			// If the context is canceled, log and stop message consumption.
			log.Info().Msgf("Context cancelled, shutting down %s", workerName)
			return nil
		default:
			// Fetch the next message from the Kafka topic.
			msg, err := r.FetchMessage(ctx)
			if err != nil {
				return err // Return error if message fetching fails.
			}

			// Process the fetched message using the worker's processing logic.
			ProcessMessage(msg, workerName)

			// Commit the message offset to Kafka to mark it as successfully processed.
			if err := r.CommitMessages(ctx, msg); err != nil {
				// Log error if commit fails.
				log.Error().
					Err(err).
					Str("topic", msg.Topic).
					Str("worker", workerName).
					Int("partition", msg.Partition).
					Str("kafka_message", string(msg.Value))
			}
		}
	}
}
