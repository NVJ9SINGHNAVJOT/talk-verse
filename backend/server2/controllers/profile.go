package controllers

import (
    "github.com/gin-gonic/gin"
)

func SetUserDetails(c *gin.Context) {
    // Your login logic here
    c.JSON(200, gin.H{"message": "Login successful"})
}