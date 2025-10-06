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
	// "net/http"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
	UserID  int    `json:"user_id,omitempty"`
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

	var uid int
	var psswrd string

	err := db.DB.QueryRow("SELECT id, password FROM accounts WHERE name = ?", req.Username).Scan(&uid, &psswrd)

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
		UserID:  uid,
	}

	sessionID := generateSessionID()
	sessions[sessionID] = req.Username

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionID,
		Expires:  time.Now().Add(30 * time.Minute),
		HttpOnly: true,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
