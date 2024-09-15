package kafka

import (
	"context"
	"sync"

	"github.com/nvj9singhnavjot/talkverse-server-kafka/config"
	"github.com/rs/zerolog/log"
	"github.com/segmentio/kafka-go"
)

// Define topics we are going to consume from
var topics = []string{"message", "gpMessage", "unseenCount"}

// KafkaConsumeSetup starts Kafka consumers and handles shutdown and errors
func KafkaConsumeSetup(ctx context.Context, errChan chan<- error) {
	var wg sync.WaitGroup

	// Start consumer workers for each topic
	for i, topic := range topics {
		wg.Add(1)
		go func(workerID int, topic string) {
			defer wg.Done()
			log.Info().Int("worker", workerID).Msg("Consumer worker started for topic " + topic)
			if err := consumeMessages(ctx, topic, workerID); err != nil {
				errChan <- err // Send error to error channel
			}
		}(i, topic)
	}

	// Wait for all workers to finish
	wg.Wait()
	close(errChan) // Close the error channel when all workers are done
}

// consumeMessages listens for Kafka messages and processes them
func consumeMessages(ctx context.Context, topic string, workerID int) error {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{config.Envs.KAFKA_BROKERS},
		GroupID:   config.Envs.KAFKA_GROUP_ID,
		Topic:     topic,
		Partition: -1,
	})

	defer r.Close()

	for {
		select {
		case <-ctx.Done():
			log.Info().Int("worker", workerID).Msg("Stopping consumer worker")
			return nil // Stop gracefully
		default:
			// Fetch message with context
			msg, err := r.FetchMessage(ctx)
			if err != nil {
				log.Error().Err(err).Msgf("Error fetching message in worker %d", workerID)
				return err // Return exact error if Kafka worker fails
			}

			// Process the message
			processMessage(msg, workerID)

			// Commit the message
			if err := r.CommitMessages(ctx, msg); err != nil {
				log.Error().Err(err).Msg("Failed to commit message")
			}
		}
	}
}

// processMessage processes individual Kafka messages
func processMessage(msg kafka.Message, workerID int) {
	log.Info().
		Int("worker", workerID).
		Str("topic", msg.Topic).
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
