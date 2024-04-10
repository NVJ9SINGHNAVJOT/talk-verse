package routes

import (
	"server2/controllers"
    "server2/middlewares"

	"github.com/gin-gonic/gin"
)

func ProfileRoutes(r *gin.Engine) {
    profile := r.Group("/api/server2/v1/profile")
    {
        profile.POST("/setuserdetails", middlewares.AuthMiddleware() , controllers.SetUserDetails)
    }
}
