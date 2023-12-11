package routes

import "github.com/gin-gonic/gin"

func HandleWelcome(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Welcome to the Shell Control Server!",
	})
}
