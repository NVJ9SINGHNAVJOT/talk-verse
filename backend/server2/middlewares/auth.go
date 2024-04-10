package middlewares

import (
	"net/http"
	"strings"
	"server2/helpers/jwt"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorizationHeader := c.GetHeader("Authorization")
		if authorizationHeader == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authorizationHeader, "Bearer ", "", 1)
		claims, err := jwt.ValidateJWT(tokenString, c)
		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// Set claims in the context for later use
		c.Set("claims", claims)

		// Proceed to the next handler
		c.Next()
	}
}