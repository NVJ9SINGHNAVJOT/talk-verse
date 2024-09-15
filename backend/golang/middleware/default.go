package middleware

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func DefaultMiddlewares(router *chi.Mux, allowedOrigins []string, allowedMethods []string, throttle int) {
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: allowedOrigins,
		AllowedMethods: allowedMethods,
		AllowedHeaders: []string{
			"Origin",
			"X-Requested-With",
			"Authorization",
			"Accept"},
		AllowCredentials: true,
	}))
	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Throttle(throttle))
}
