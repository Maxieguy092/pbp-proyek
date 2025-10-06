package controllers

import (
	// "backend/config"
	// "backend/models"
	// "backend/utils"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
	// "net/http"
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

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	var email string
	var psswrd string
	var name string

	err := db.DB.QueryRow("SELECT email, email, password FROM accounts WHERE email = ?", req.Username).Scan(&name, &email, &psswrd)

	if err == sql.ErrNoRows {
		http.Error(w, "No User", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	if psswrd != req.Password {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	resp := LoginResponse{
		Message: "Login successful",
		UserID:  name,
	}

	sessionID := generateSessionID()
	sessions[sessionID] = req.Username

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionID,
		Expires:  time.Now().Add(30 * time.Minute),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,                  // true if you serve HTTPS
		SameSite: http.SameSiteNoneMode, // required for cross-origin
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func Logout(c *gin.Context) {
	c.SetCookie("session_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

func CheckSession(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		http.Error(w, "No session cookie", http.StatusUnauthorized)
		fmt.Println("❌ No cookie found")
		return
	}

	username, exists := sessions[cookie.Value]
	if !exists {
		http.Error(w, "Invalid or expired session", http.StatusUnauthorized)
		fmt.Println("❌ Invalid session:", cookie.Value)
		return
	}

	fmt.Println("✅ Session valid for:", username)

	response := map[string]string{
		"message":  "Session valid",
		"username": username,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
