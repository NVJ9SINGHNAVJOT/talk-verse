package helper

import (
	"github.com/go-playground/validator/v10"
)

// Declare the validator variable.
var validate *validator.Validate

// Initialize the validator.
func InitializeValidator() {
	validate = validator.New(validator.WithRequiredStructEnabled())
}

// ValidateStruct validates any struct passed in
func ValidateStruct(target interface{}) error {
	if err := validate.Struct(target); err != nil {
		return err
	}

	return nil
}
