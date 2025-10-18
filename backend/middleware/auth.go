package middleware

import (
	"net/http"

	"github.com/Maxiegame092/pbp-app/controllers" // Impor controllers untuk akses `sessions`
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("session_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		email, exists := controllers.Sessions[cookie] // Akses map sessions dari package controllers
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
			return
		}

		// Simpan email pengguna di context untuk digunakan di handler selanjutnya
		c.Set("userEmail", email)

		c.Next()
	}
}