package jwt

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(username string) (string, error) {
	// Use HS256 for signing method
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":        time.Now().Add(1 * time.Minute).Unix(), // Set expiration time (e.g., 1 minute)
		"authorized": true,                                   // Set authorized to true
		"user":       username,                               // Set user (you can customize this)
	})

	// Set your secret key (store it securely, preferably in an .env file)
	var sampleSecretKey = []byte("SecretYouShouldHide")

	tokenString, err := token.SignedString(sampleSecretKey)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	return tokenString, nil
}
