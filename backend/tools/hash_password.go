// File: hash_password.go
package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Pastikan ada argumen yang diberikan (password)
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run hash_password.go <password>")
		os.Exit(1)
	}

	// Ambil password dari argumen command-line
	password := os.Args[1]

	// Generate hash dari password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		os.Exit(1)
	}

	// Cetak hash ke terminal
	fmt.Println(string(hashedPassword))
}