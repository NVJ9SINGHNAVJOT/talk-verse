package kafka

import (
	"context"
	"fmt"
	"time"

	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/config"
	"github.com/segmentio/kafka-go"
)

// CheckAllKafkaConnections checks if all Kafka brokers are reachable.
func CheckAllKafkaConnections() error {
	// Create a new dialer for checking the connections
	dialer := &kafka.Dialer{
		Timeout:   10 * time.Second, // Timeout for dialing the broker
		KeepAlive: 20 * time.Second, // Keep connection alive duration
	}

	// Iterate over each broker and attempt to connect
	for _, broker := range config.Envs.KAFKA_BROKERS {
		conn, err := dialer.DialContext(context.Background(), "tcp", broker)
		if err != nil {
			return fmt.Errorf("failed to connect to broker %s: %v", broker, err) // Return error for failed connection
		}

		// Close the connection and check for errors
		if closeErr := conn.Close(); closeErr != nil {
			return fmt.Errorf("failed to close connection to broker %s: %v", broker, closeErr)
		}
	}

	return nil // Return nil if all connections are successful
}
