package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"server2/db/postgresql"
	"server2/routes"
)

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{
			"PUT",
			"PATCH",
			"POST",
			"GET",
			"DELETE",
		},
		AllowHeaders: []string{
			"Origin",
			"X-Requested-With",
			"Authorization",
			"Content-Type",
			"Refresh-Token",
			"Accept",
		},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:5173"
		},
		MaxAge: 12 * time.Hour,
	}))

	postgresql, dberr := postgresql.PostgreSQLDatabaseConnect()

	if dberr != nil {
		fmt.Println("error while connecting postgresql", dberr)
	}

	defer postgresql.Close()

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "server2 is up and running..."})
	})

	routes.AuthRoutes(router)
	routes.ProfileRoutes(router)

	fmt.Println("server2 running...")

	err := router.Run(":8080")

	if err != nil {
		fmt.Println("error while running server2")
	}

}
