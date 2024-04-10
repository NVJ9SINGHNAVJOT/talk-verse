package jwt

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func ValidateJWT(tokenString string, c *gin.Context) (jwt.MapClaims, error) {
	// Set your secret key (same as used during token generation)
	secret := []byte("SecretYouShouldHide")

	// Parse the token and verify its signature
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check that the signing method is as expected
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		// Return the secret key
		return secret, nil
	})

	// Check for errors
	if err != nil {
		// Return unauthorized status (401)
		return nil, err
	}

	// Check that the token is valid
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims)
		return claims, nil
	} else {
		// Abort with invalid token status (401)
		c.AbortWithStatusJSON(401, "invalid token")
	}

	return nil, nil
}
