package main

import (
	"encoding/json"
	"net/http"
	"os"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func main() {
	// Example handler
	http.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
		users := []User{
			{ID: 1, Name: "Alice"},
			{ID: 2, Name: "Bob"},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)
	})

	// Get port from env or fallback to 5000
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	println("Backend running at http://localhost:" + port)
	http.ListenAndServe(":"+port, nil)
}
