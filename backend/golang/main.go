package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
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
	}

	// Setup logger
	config.SetUpLogger(config.Envs.ENVIRONMENT)

	// Connect to MongoDB
	err = db.ConnectMongoDB()
	if err != nil {
		log.Fatal().Err(err).Msg("Error connecting to MongoDB")
	}

	// Context for managing shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Ensure context is cancelled on shutdown

	// Error channel to listen to Kafka worker errors
	errChan := make(chan error)

	// Kafka consumers setup
	go func() {
		kafka.KafkaConsumeSetup(ctx, errChan)
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

	// Shutdown handling using signal
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

		select {
		case sig := <-sigChan:
			log.Info().Msgf("Received signal: %s. Shutting down...", sig)
		case err := <-errChan:
			log.Error().Err(err).Msg("Kafka worker error. Shutting down...")
		}

		// Call cancel to shut down consumers
		cancel()

		// Give server some time to finish ongoing requests
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer shutdownCancel()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Error().Err(err).Msg("HTTP server shutdown error")
		}
	}()

	// Start the HTTP server
	log.Info().Msg("Server is running...")
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal().Err(err).Msg("HTTP server crashed")
	}

	log.Info().Msg("Server stopped")
}
