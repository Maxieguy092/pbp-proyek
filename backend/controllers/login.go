package controllers

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"net/http"
	"strings"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql" // Impor driver MySQL untuk error handling
	"golang.org/x/crypto/bcrypt"     // Impor package bcrypt untuk hashing
)

// Struct untuk request body
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

// Manajemen sesi sederhana (in-memory)
var Sessions = map[string]string{}

func generateSessionID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

// ================================================================
//
//	FUNGSI REGISTER BARU
//
// ================================================================
func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if req.FirstName == "" || req.LastName == "" || req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	query := "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)"
	_, err = db.DB.Exec(query, req.FirstName, req.LastName, req.Email, string(hashedPassword))

	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			if strings.Contains(mysqlErr.Message, "email") {
				c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
				return
			}
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// ================================================================
//
//	FUNGSI LOGIN DENGAN PERBAIKAN KEAMANAN
//
// ================================================================
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	var firstName, lastName, email, psswrd string
	err := db.DB.QueryRow("SELECT first_name, last_name, email, password_hash FROM users WHERE email = ?", req.Username).Scan(&firstName, &lastName, &email, &psswrd)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	} else if err != nil {
		fmt.Println("Database error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(psswrd), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid password"})
		return
	}

	// --- BAGIAN YANG DIPERBAIKI ---
	// 1. Buat sesi dan cookie terlebih dahulu
	sessionID := generateSessionID()
	Sessions[sessionID] = email // Simpan email sebagai identifier sesi
	c.SetCookie("session_token", sessionID, 30*60, "/", "localhost", false, true)

	// 2. Kirim respons JSON dalam satu panggilan
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"firstName": firstName,
			"lastName":  lastName,
			"email":     email,
		},
	})
}

func Logout(c *gin.Context) {
	c.SetCookie("session_token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

func CheckSession(c *gin.Context) {
	cookie, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no session cookie"})
		return
	}

	email, exists := Sessions[cookie]
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired session"})
		return
	}

	var firstName, lastName string
	query := "SELECT first_name, last_name FROM users WHERE email = ?"
	err = db.DB.QueryRow(query, email).Scan(&firstName, &lastName)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"firstName": firstName,
		"lastName":  lastName,
		"email":     email,
	})
}

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("session_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "no session cookie"})
			return
		}

		email, exists := sessions[cookie]
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired session"})
			return
		}

		var role string
		err = db.DB.QueryRow("SELECT role FROM users WHERE email = ?", email).Scan(&role)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user role"})
			return
		}

		if role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden: admin only"})
			return
		}

		// store email in context for next handlers if needed
		c.Set("email", email)
		c.Next()
	}
}
