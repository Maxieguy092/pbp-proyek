package middleware

import (
	"net/http"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/Maxiegame092/pbp-app/controllers"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("session_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		email, exists := controllers.Sessions[cookie] 
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
			return
		}

		var userID int
		query := "SELECT id FROM users WHERE email = ?"
		err = db.DB.QueryRow(query, email).Scan(&userID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: User not found for this session"})
			return
		}

		c.Set("user_id", userID)

		c.Next()
	}
}
