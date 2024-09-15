package helper

import (
	"encoding/json"
	"net/http"

	"github.com/rs/zerolog/log"
)

type apiResponse struct {
	Message string `json:"message" validate:"required"`
	Data    any    `json:"data,omitempty"`
}

func Response(w http.ResponseWriter, status int, message string, data any) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	response := apiResponse{
		Message: message,
	}

	if status > 299 {
		// NOTE: if status more than 299 any data passed is nil or error
		if data != nil {
			log.Error().Any("error", data).Msg(message)
		} else {
			log.Error().Msg(message)
		}
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Error().Str("error", err.Error()).Msg("error encoding to json")
			http.Error(w, `{"message":"internal server error, while encoding json"}`, http.StatusInternalServerError)
		}
		return
	}

	if data != nil {
		response.Data = data
	}
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Error().Str("error", err.Error()).Msg("error encoding to json")
		http.Error(w, `{"message":"internal server error, while encoding json"}`, http.StatusInternalServerError)
	}
}
