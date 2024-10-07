package helper

import (
	"encoding/json"

	"github.com/go-playground/validator/v10"
)

// Declare the validator variable.
var validate *validator.Validate

// Initialize the validator.
func InitializeValidator() {
	validate = validator.New(validator.WithRequiredStructEnabled())
}

// UnmarshalAndValidate takes JSON data in bytes and a pointer to a struct,
// unmarshals the data into the struct and validates it
func UnmarshalAndValidate(data []byte, target interface{}) (string, error) {
	// Unmarshal the incoming data into the target struct
	err := json.Unmarshal(data, target)
	if err != nil {
		return "Failed to unmarshal JSON", err
	}

	// Validate the unmarshalled struct
	if err = validate.Struct(target); err != nil {
		return "Validation failed", err
	}

	// Return success if no errors
	return "", nil
}
