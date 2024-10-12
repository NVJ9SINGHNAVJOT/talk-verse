package kafka

import (
	"context"
	"encoding/json"

	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/config"
	"github.com/segmentio/kafka-go"
)

// Kafka writer instance used for sending messages to the Kafka cluster.
// It connects to the brokers specified in the environment configuration.
var writer = kafka.Writer{
	Addr:        kafka.TCP(config.Envs.KAFKA_BROKERS...), // Set the Kafka brokers using environment variables
	MaxAttempts: 10,                                      // Configure the writer to retry sending messages up to 10 times in case of failure
}

// Produce sends a message to the specified Kafka topic.
// It takes the topic name and the message value (which will be serialized to JSON) as arguments.
func Produce(topic string, value interface{}) error {
	// Marshal the value (interface{}) into JSON format for sending to Kafka
	jsonValue, err := json.Marshal(value)
	if err != nil {
		// Return an error if JSON marshaling fails
		return err
	}

	// Create a Kafka message with the given topic and JSON-encoded value
	message := kafka.Message{
		Topic: topic,     // Dynamically assign the topic for the message
		Value: jsonValue, // Set the serialized JSON payload as the message value
	}

	// Write the message to the Kafka topic using the writer instance
	return writer.WriteMessages(context.Background(), message)
}

// Close gracefully closes the Kafka writer, ensuring all buffered messages are sent.
// It should be called when the producer is no longer needed to free resources properly.
func Close() error {
	// Close the Kafka writer and return any error that occurs during the process
	return writer.Close()
}
