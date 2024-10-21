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

// List of topics to be consumed by the Kafka consumer.
// These topics are predefined and will be used to spawn consumers.
var topics = []string{"message", "gp-message", "unseen-count"}

// retryAttempts defines how many times a worker will retry to consume a message
// if there is a failure during message consumption.
const retryAttempts = 5

// backoffDurations contains the predefined wait times between each retry attempt.
// The durations grow exponentially to avoid overloading the system with retries.
var backoffDurations = []time.Duration{
	4 * time.Second,  // Wait 4 seconds before 2nd attempt
	8 * time.Second,  // Wait 8 seconds before 3rd attempt
	16 * time.Second, // Wait 16 seconds before 4th attempt
	20 * time.Second, // Wait 20 seconds before 5th (final) attempt
}

// topicTracker tracks the number of active workers for a specific topic.
// It uses a mutex to ensure that modifications to the worker count are thread-safe.
type topicTracker struct {
	count int        // Number of active workers for the topic
	lock  sync.Mutex // Mutex to synchronize access to the worker count
}

// workerTracker manages the worker count for multiple topics using a map.
// Each topic has its own tracker to maintain and control worker concurrency.
type workerTracker struct {
	topics map[string]*topicTracker // A map of topics with their respective worker trackers
}

// workerErrorManager is a global instance of workerTracker to manage worker counts.
// It initializes an empty map that will later hold topics and their corresponding worker counts.
var workerErrorManager = workerTracker{
	topics: make(map[string]*topicTracker), // Initialize the topics map
}

// decrementWorker safely decreases the worker count for a given topic in the workerTracker.
// It locks the topic-specific mutex to ensure that no other goroutines modify the worker count simultaneously.
// If there are remaining workers for the topic, it logs a warning with the updated worker count.
// If all workers for the topic are exhausted, it logs an error indicating that no workers remain.
func (w *workerTracker) decrementWorker(_ context.Context, group, topic, workerName string, _ *sync.WaitGroup) {
	// Acquire the lock for the given topic to ensure thread-safe access to the worker count
	t := w.topics[topic]
	t.lock.Lock()
	defer t.lock.Unlock() // Ensure the lock is released after the count is updated

	// Decrement the worker count for the specified topic
	t.count--
	log.Warn().
		Str("topic", topic).
		Str("group", group).
		Str("workerName", workerName).Msg("worker stopped")

	// HACK: New worker can be added if needed.
	// Currently, no new worker is started, but all necessary parameters (group name, topic name, worker name)
	// are available to start a replacement worker if required after this decrement operation.
	if t.count > 0 {
		// Log a warning if only one or a few workers remain for the topic
		log.Warn().
			Str("topic", topic).
			Str("group", group).
			Msgf("Only %d worker(s) remaining", t.count)
	} else {
		// Log an error if no workers are left to process the topic
		log.Error().
			Str("topic", topic).
			Str("group", group).
			Msg("No workers remaining")
	}
}

// KafkaConsumeSetup initializes Kafka consumers by assigning a specified number of workers per topic.
// It creates consumer groups and spawns workers to handle message consumption concurrently.
func KafkaConsumeSetup(ctx context.Context, workDone chan int, workersPerTopic int, wg *sync.WaitGroup) {
	// Initialize worker counts for each topic by setting up a tracker for each.
	for _, topic := range topics {
		workerErrorManager.topics[topic] = &topicTracker{count: workersPerTopic} // Set worker count
	}

	// Loop through each topic to create consumer groups and spawn workers
	for _, topic := range topics {
		// Create a Kafka consumer group name by combining the project name "talkverse" with the topic name
		// and a suffix to indicate it's a consumer group.
		// For example, if the topic is "message",
		// the resulting groupName will be: "talkverse-message-group".
		// This "talkverse-message-group" is the group name used for all workers under this topic.

		groupName := fmt.Sprintf("talkverse-%s-group", topic)

		// Log the creation of the consumer group, showing details such as the topic name, the generated group name,
		// and the number of workers assigned to handle this topic's messages.
		log.Info().
			Str("topic", topic).
			Str("group", groupName).
			Int("workersCount", workersPerTopic).
			Msg("Starting consumer group")

		// For each topic, spawn a set number of workers, each responsible for consuming messages from the topic.
		// Workers will operate concurrently, with each being uniquely identified.
		for workerID := 1; workerID <= workersPerTopic; workerID++ {
			wg.Add(1) // Increment the WaitGroup counter to track worker completion

			// Create a unique worker name by appending a worker-specific ID to the group name.
			// This ensures that each worker within the group has a unique identity, which includes the topic name,
			// the group name, and its own ID. For example:
			// If the groupName is "talkverse-message-group" and the workerID is 1,
			// the resulting workerName will be: "talkverse-message-group-worker-1".
			// Here, "talkverse-message-group" is the group name for this worker, and "worker-1" is the worker's unique ID within this group.
			workerName := fmt.Sprintf("%s-worker-%d", groupName, workerID)

			// Start a goroutine for each worker, which will handle message consumption with retry logic
			go consumeWithRetry(ctx, groupName, topic, workerName, wg)
		}
	}

	// Wait for all workers to finish processing
	wg.Wait()
	log.Info().Msg("All workers have completed processing") // Log completion of all workers

	// Close the workDone channel to signal that worker processing is complete
	log.Info().Msg("Closing workDone channel")
	close(workDone)
}

// consumeWithRetry attempts to consume messages from a Kafka topic and retries in case of failure.
// It retries up to the defined number of retryAttempts and applies exponential backoff between attempts.
func consumeWithRetry(ctx context.Context, group, topic, workerName string, wg *sync.WaitGroup) {
	defer wg.Done() // Decrement the WaitGroup counter when the worker completes

	// Log the start of the worker
	log.Info().
		Str("topic", topic).
		Str("group", group).
		Str("worker", workerName).
		Msg("Starting worker")

	// Loop to retry message consumption
	for attempt := 1; attempt <= retryAttempts; attempt++ {
		// Attempt to consume a message from the Kafka topic
		err := consumeKafkaTopic(ctx, group, topic, workerName)

		// Check if an error occurred and retry if it's not a context cancellation error
		if err != nil && !errors.Is(err, context.Canceled) {
			// Log the error and the retry attempt
			log.Error().
				Err(err).
				Str("worker", workerName).
				Str("attempt", fmt.Sprintf("%d/%d", attempt, retryAttempts)).
				Msg("Error during message consumption, retrying")

			// Apply a backoff duration before the next retry attempt
			if attempt < retryAttempts {
				time.Sleep(backoffDurations[attempt-1])
			}
		} else {
			// Log successful consumption and exit the loop if no errors occurred
			log.Info().
				Str("worker", workerName).
				Msg("Successfully consumed messages")
			return
		}
	}

	// If retries are exhausted, log a warning and decrement the worker count
	log.Warn().Str("topic", topic).Str("worker", workerName).Msg("Retries exhausted for worker")
	workerErrorManager.decrementWorker(ctx, group, topic, workerName, wg)
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
			KeepAlive: 1 * time.Minute, // Keep the connection alive for 1 minutes.
		},
		HeartbeatInterval: 3 * time.Second, // Interval for sending heartbeats to Kafka brokers.
		MaxAttempts:       retryAttempts,   // Maximum number of attempts to consume a message.
	})

	// Ensure the Kafka reader is closed properly when the function exits.
	defer func() {
		if err := r.Close(); err != nil {
			log.Error().Err(err).Str("worker", workerName).Msg("Failed to close Kafka reader")
		}
	}()

	// Infinite loop to continuously consume messages from the Kafka topic.
	for {
		select {
		case <-ctx.Done():
			// If the context is canceled, log and stop message consumption.
			log.Info().Str("worker", workerName).Msg("Context cancelled, shutting down")
			return nil
		default:
			// Fetch the next message from the Kafka topic.
			msg, err := r.FetchMessage(ctx)
			if err != nil {
				return err // Return error if message fetching fails.
			}

			// Process the fetched message using the worker's processing logic.
			ProcessMessage(msg, workerName)

			// Create a 1-minute context for committing the message offset.
			commitCtx, commitCancel := context.WithTimeout(context.Background(), 1*time.Minute)

			// Commit the message offset to Kafka to mark the message as successfully processed.
			if err = r.CommitMessages(commitCtx, msg); err != nil {
				// Log an error if committing the message offset fails.
				log.Error().
					Err(err).
					Str("worker", workerName).
					Interface("message_details", map[string]interface{}{
						"topic":         msg.Topic,
						"partition":     msg.Partition,
						"offset":        msg.Offset,
						"highWaterMark": msg.HighWaterMark,
						"value":         string(msg.Value),
						"time":          msg.Time,
					}).
					Msg("Commit failed for message offset")
			}

			// Call the cancel function to release resources after each message commit.
			commitCancel()
		}
	}
}
