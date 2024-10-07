package pkg

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// LoadEnv loads environment variables from a given file, handling comments and preserving existing variables.
// If the file does not exist, it logs a message and uses system environment variables instead.
//
// NOTE: filePath is used for development, for production with Docker it logs that the file is not found,
// and environment variables from the Docker container will be used.
func LoadEnv(filePath string) error {
	// Check if the file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		// Log that the env file was not found, and environment variables will be loaded from the system.
		// For Docker, the environment variables would come from the container configuration.
		fmt.Printf("Env file not found at %s. In production, environment variables from the Docker container will be used.", filePath)
		return nil
	}

	// Open the specified environment variable file.
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("error opening env file: %v", err)
	}
	defer file.Close() // Ensure the file is closed when done.

	scanner := bufio.NewScanner(file) // Create a scanner to read the file line by line.
	lineNumber := 0                   // Initialize a line number counter.

	for scanner.Scan() {
		lineNumber++                              // Increment line number for each line read.
		line := strings.TrimSpace(scanner.Text()) // Trim whitespace from the line.

		// Ignore empty lines and lines that are comments.
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		// Remove inline comments after the actual environment variable.
		if idx := strings.Index(line, "#"); idx != -1 {
			line = strings.TrimSpace(line[:idx])
		}

		// Split the line into key-value pairs by the first '=' character.
		keyValue := strings.SplitN(line, "=", 2)
		if len(keyValue) != 2 {
			return fmt.Errorf("invalid env line at line %d", lineNumber) // Return error with line number.
		}

		key := strings.TrimSpace(keyValue[0])   // Extract and trim the key.
		value := strings.TrimSpace(keyValue[1]) // Extract and trim the value.

		// Only set the environment variable if it doesn't already exist.
		if _, exists := os.LookupEnv(key); !exists {
			os.Setenv(key, value) // Set the environment variable.
		} else {
			fmt.Printf("Variable %s already exists, skipping...", key) // Log if the variable is already set.
		}
	}

	// Check for errors during scanning.
	if err := scanner.Err(); err != nil {
		return fmt.Errorf("error reading env file: %v", err) // Return any errors encountered.
	}

	return nil // Return nil if no errors occurred.
}
