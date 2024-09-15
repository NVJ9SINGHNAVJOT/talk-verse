package middleware

import (
	"net/http"
	"strings"

	"github.com/nvj9singhnavjot/talkverse-server-kafka/helper"
)

// ServerKey is a middleware function that checks if the request contains
// a valid Authorization header with a Bearer token that matches the specified serverKey.
// It returns an http.Handler that wraps the given next http.Handler.
//
// serverKey: The key that the Authorization Bearer token must match for the request to be authorized.
//
// Example usage:
// http.Handle("/", ServerKey("my-secret-key")(myHandler))
func ServerKey(serverKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Retrieve the Authorization header from the request
			checkKey := r.Header.Get("Authorization")

			// Remove the "Bearer " prefix from the Authorization header value
			checkKey = strings.TrimPrefix(checkKey, "Bearer ")

			// Check if the provided key matches the serverKey
			if checkKey == serverKey {
				// If the key matches, proceed to the next handler
				next.ServeHTTP(w, r)
			} else {
				// If the key does not match, respond with a 403 Forbidden status
				helper.Response(w, http.StatusForbidden, "unauthorized access denied for server", nil)
			}
		})
	}
}
