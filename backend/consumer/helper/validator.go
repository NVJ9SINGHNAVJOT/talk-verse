package helper

import (
	"encoding/json"
	"reflect"

	"github.com/go-playground/validator/v10"
)

// Declare the validator variable.
var validate *validator.Validate

// NOTE: custom validation functions for validate declared below

// customNonNegativeInt is a custom validation function for integer fields.
// It ensures that the field is either an int or int64, and that the value is non-negative (0 or positive).
// This allows zero to be a valid value but rejects negative integers.
func customNonNegativeInt(fl validator.FieldLevel) bool {
	// Check if the field is an int or int64 type
	if fl.Field().Kind() == reflect.Int || fl.Field().Kind() == reflect.Int64 {
		value := fl.Field().Int() // Get the integer value
		return value >= 0         // Return true if the value is 0 or positive
	}
	return false // If the field is not an integer, the validation fails
}

// Initialize the validator.
func InitializeValidator() {
	validate = validator.New(validator.WithRequiredStructEnabled())

	// Register custom validators
	validate.RegisterValidation("customNonNegativeInt", customNonNegativeInt) // Register non-negative integer validator
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
