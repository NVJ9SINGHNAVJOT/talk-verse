package main

import (
	"context"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/config"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/db"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/helper"
	"github.com/nvj9singhnavjot/talkverse-kafka-consumer/kafka"
	"github.com/rs/zerolog/log"
)

func main() {
	// Validate environment variables
	err := config.ValidateEnvs()
	if err != nil {
		log.Fatal().Err(err).Msg("Invalid environment variables")
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

	// Context for managing shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Ensure context is cancelled on shutdown

	// Error channel to listen to Kafka worker errors
	errChan := make(chan kafka.WorkerError)

	// Initialize WorkerTracker to track remaining workers per topic
	workerTracker := kafka.NewWorkerTracker(config.Envs.KAFKA_GROUP_WORKERS)

	// Kafka consumers setup
	go kafka.KafkaConsumeSetup(ctx, errChan, config.Envs.KAFKA_GROUP_WORKERS, &wg)

	// sync.Once to ensure shutdown happens only once
	var shutdownOnce sync.Once

	// Shutdown handling using signal and worker tracking
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	for {
		select {
		case sig := <-sigChan:
			log.Info().Msgf("Received signal: %s. Shutting down...", sig)

			// Wait for all Kafka workers to finish before shutting down the service
			log.Info().Msg("Waiting for Kafka workers to complete...")
			cancel() // Cancel context to signal Kafka workers to shut down

			wg.Wait() // Wait for all worker goroutines to complete
			log.Info().Msg("All Kafka workers stopped")

			// Consume all remaining error messages from errChan before shutting down
		ConsumeErrors:
			for {
				select {
				case workerErr, ok := <-errChan:
					if ok {
						log.Error().Err(workerErr.Err).Msgf("Kafka worker error for topic: %s, workerName: %s", workerErr.Topic, workerErr.WorkerName)
					} else {
						log.Info().Msg("All remaining Kafka worker errors consumed. Proceeding with shutdown.")
						break ConsumeErrors // Break out of the labeled loop
					}
				default:
					// No more error messages to consume
					log.Info().Msg("No more worker errors to process.")
					break ConsumeErrors // Break out of the labeled loop
				}
			}

			// Gracefully shut down the Kafka consumer service
			shutdownOnce.Do(func() {
				shutdownConsumer()
			})
			return

		case workerErr, ok := <-errChan:
			if !ok {
				// If the channel is closed, all workers are done, so shut down
				log.Info().Msg("Worker error channel closed, all Kafka workers finished. Initiating service shutdown...")
				shutdownOnce.Do(func() {
					shutdownConsumer()
				})
				return
			}

			log.Error().Err(workerErr.Err).Msgf("Kafka worker error for topic: %s, workerName: %s", workerErr.Topic, workerErr.WorkerName)

			// Reduce worker count for the topic
			remainingWorkers := workerTracker.DecrementWorker(workerErr.Topic)

			if remainingWorkers == 1 {
				log.Warn().Msgf("Only one worker remaining for topic: %s", workerErr.Topic)
			} else if remainingWorkers == 0 {
				log.Error().Msgf("No workers remaining for topic: %s", workerErr.Topic)
			}
		}
	}
}

// shutdownConsumer gracefully shuts down the Kafka consumer service
func shutdownConsumer() {
	log.Info().Msg("Shutting down the Kafka consumer service...")

	// Close mongodb database connection
	if err := db.DisconnectMongoDB(); err != nil {
		log.Error().Err(err).Msg("failed to disconnect mongodb client")
	}
	log.Info().Msg("MongoDB disconnected")
	log.Info().Msg("Kafka consumer service shutdown complete.")
}
