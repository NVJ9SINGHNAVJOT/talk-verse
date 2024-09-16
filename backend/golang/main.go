package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
	"github.com/nvj9singhnavjot/talkverse-server-kafka/config"
	"github.com/nvj9singhnavjot/talkverse-server-kafka/db"
	"github.com/nvj9singhnavjot/talkverse-server-kafka/helper"
	"github.com/nvj9singhnavjot/talkverse-server-kafka/kafka"
	mw "github.com/nvj9singhnavjot/talkverse-server-kafka/middleware"
	"github.com/rs/zerolog/log"
)

func main() {
	// Validate environment variables
	err := config.ValidateEnvs()
	if err != nil {
		log.Fatal().Err(err).Msg("Invalid environment variables")
		panic(err)
	}

	// Setup logger
	config.SetUpLogger(config.Envs.ENVIRONMENT)

	// Get groupsCount from environment
	groupWorkersCount, err := strconv.Atoi(config.Envs.KAFKA_GROUP_WORKERS)
	if err != nil {
		log.Fatal().Err(err).Msg("Error getting groupWorkersCount")
		panic(err)
	}

	// Connect to MongoDB
	err = db.ConnectMongoDB()
	if err != nil {
		log.Fatal().Err(err).Msg("Error connecting to MongoDB")
	}

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
	workerTracker := kafka.NewWorkerTracker(groupWorkersCount)

	// Kafka consumers setup
	go func() {
		kafka.KafkaConsumeSetup(ctx, errChan, groupWorkersCount, &wg)
	}()

	// HTTP server setup
	router := chi.NewRouter()

	// Default middlewares
	mw.DefaultMiddlewares(router, []string{"*"}, []string{"GET"}, 10)

	// Server key middleware
	router.Use(mw.ServerKey(config.Envs.SERVER_KEY))

	// Content encoding middleware
	router.Use(middleware.AllowContentEncoding("deflate", "gzip"))
	router.Use(httprate.LimitByIP(10, 1*time.Minute))

	// Health check route
	router.Get("/healthCheck", func(w http.ResponseWriter, r *http.Request) {
		helper.Response(w, 200, "Health OK", nil)
	})

	// Root route
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		helper.Response(w, 200, "Server running...", nil)
	})

	// Setup the server with a graceful shutdown
	srv := &http.Server{
		Addr:    ":" + config.Envs.PORT,
		Handler: router,
	}

	// Shutdown handling using signal and worker tracking
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

		for {
			select {
			case sig := <-sigChan:
				log.Info().Msgf("Received signal: %s. Shutting down...", sig)
				cancel() // Cancel context to signal Kafka workers to shut down

				// Wait for all Kafka workers to finish before shutting down the server
				log.Info().Msg("Waiting for Kafka workers to complete...")
				wg.Wait() // Wait for all worker goroutines to complete
				log.Info().Msg("All Kafka workers stopped")

				// Now gracefully shut down the HTTP server
				shutdownServer(srv)
				return

			case workerErr := <-errChan:
				log.Error().Err(workerErr.Err).Msgf("Kafka worker error for topic: %s, workerName: %s", workerErr.Topic, workerErr.WorkerName)

				// Reduce worker count for the topic
				remainingWorkers := workerTracker.DecrementWorker(workerErr.Topic)

				if remainingWorkers == 1 {
					log.Warn().Msgf("Only one worker remaining for topic: %s. Shutting down...", workerErr.Topic)
					cancel() // Cancel the context to shut down all workers

					log.Info().Msg("Waiting for Kafka workers to complete...")
					wg.Wait() // Wait for all worker goroutines to complete
					log.Info().Msg("All Kafka workers stopped")

					// Shut down the HTTP server after workers finish
					shutdownServer(srv)
					return
				}
			}
		}
	}()

	// Start the HTTP server
	log.Info().Msg("Server is running...")
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal().Err(err).Msg("HTTP server crashed")
		cancel() // Ensure context is cancelled if server crashes
	}

	log.Info().Msg("Server stopped")
}

// shutdownServer gracefully shuts down the HTTP server
func shutdownServer(srv *http.Server) {
	// Give server some time to finish ongoing requests
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error().Err(err).Msg("HTTP server shutdown error")
	}
}
