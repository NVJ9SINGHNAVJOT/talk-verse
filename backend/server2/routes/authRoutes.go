package routes

import (
	"server2/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {
    auth := r.Group("/api/server2/v1/auth")
    {
        auth.POST("/signup", controllers.SignUp)
        auth.POST("/login", controllers.LogIn)
    }
}
