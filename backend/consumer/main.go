package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/config"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/db"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/helper"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/kafka"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/pkg"
	"github.com/rs/zerolog/log"
)

func main() {
	// Load env file
	err := pkg.LoadEnv(".env")
	if err != nil {
		fmt.Println("Error loading env file", err)
	}

	// Validate environment variables
	err = config.ValidateEnvs()
	if err != nil {
		fmt.Println("Invalid environment variables", err)
		panic(err)
	}

	// Setup logger
	config.SetUpLogger(config.Envs.ENVIRONMENT)

	// Check Kafka connection
	err = kafka.CheckAllKafkaConnections()
	if err != nil {
		log.Fatal().Err(err).Msg("Error checking connection with Kafka")
	}

	// Connect to MongoDB
	err = db.ConnectMongoDB()
	if err != nil {
		log.Fatal().Err(err).Msg("Error connecting to MongoDB")
	}
	log.Info().Msg("MongoDB connected")

	// Initialize validator
	helper.InitializeValidator()

	// Create a WaitGroup to track worker goroutines
	var wg sync.WaitGroup
	// workDone channel waits for all workers to complete.
	workDone := make(chan int, 1)

	// Context for managing shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Ensure context is cancelled on shutdown

	// Kafka consumers setup
	go kafka.KafkaConsumeSetup(ctx, workDone, config.Envs.KAFKA_GROUP_WORKERS, &wg)

	// Shutdown handling using signal and worker tracking
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-sigChan:
		log.Info().Msgf("Received signal: %s. Shutting down...", sig)

		cancel() // Cancel context to signal Kafka workers to shut down
		log.Info().Msg("Context cancelled")

		// Wait for all Kafka workers to finish before shutting down the service
		log.Info().Msg("Waiting for Kafka workers to complete...")
		wg.Wait() // Wait for all worker goroutines to complete
		log.Info().Msg("All Kafka workers stopped")

		// Gracefully shut down the Kafka consumer service
		shutdownConsumer()
		return

	case _, ok := <-workDone:
		if !ok {
			// If the channel is closed, all workers are done, so shut down
			log.Info().Msg("workDone channel closed, all Kafka workers finished. Initiating service shutdown...")

			shutdownConsumer()
			return
		}
	}
}

// shutdownConsumer gracefully shuts down the Kafka consumer service
func shutdownConsumer() {
	log.Info().Msg("Shutting down the Kafka consumer service...")

	// Close Kafka producer
	if err := kafka.Close(); err != nil {
		log.Error().Err(err).Msg("Failed to close Kafka producer")
	} else {
		log.Info().Msg("Kafka producer closed")
	}

	// Close mongodb database connection
	if err := db.DisconnectMongoDB(); err != nil {
		log.Error().Err(err).Msg("Failed to disconnect mongodb client")
	} else {
		log.Info().Msg("MongoDB disconnected")
	}
	log.Info().Msg("Kafka consumer service shutdown complete.")
}
