package controllers

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"net/http"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
	UserID  string `json:"username,omitempty"`
}

var sessions = map[string]string{}

func generateSessionID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func Register(w http.ResponseWriter, r *http.Request) {}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	var name, email, psswrd string
	err := db.DB.QueryRow("SELECT name, email, password FROM accounts WHERE email = ?", req.Username).Scan(&name, &email, &psswrd)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	} else if err != nil {
		fmt.Println("Database error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	if psswrd != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid password"})
		return
	}

	resp := LoginResponse{
		Message: "Login successful",
		UserID:  name,
	}
	sessionID := generateSessionID()
	sessions[sessionID] = req.Username
	c.SetCookie("session_token", sessionID, 30*60, "/", "localhost", true, true)
	c.JSON(http.StatusOK, resp)
}

func Logout(c *gin.Context) {
	c.SetCookie("session_token", "", -1, "/", "localhost", true, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

func CheckSession(c *gin.Context) {
	cookie, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no session cookie"})
		return
	}
	// BARIS INI DIPERBAIKI: langsung gunakan 'cookie', bukan 'cookie.Value'
	username, exists := sessions[cookie]
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired session"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message":  "Session valid",
		"username": username,
	})
}