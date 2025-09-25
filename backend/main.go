package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/Maxiegame092/pbp-app/internal/config"
	dbx "github.com/Maxiegame092/pbp-app/internal/db"
	"github.com/Maxiegame092/pbp-app/internal/httpx/handlers"
	"github.com/Maxiegame092/pbp-app/internal/httpx/middleware"
	"github.com/Maxiegame092/pbp-app/internal/repository"
)

func main() {
	// 1) Load config & connect DB
	cfg := config.Load()
	conn, err := dbx.Connect(cfg)
	if err != nil {
		log.Fatalf("DB connect error: %v", err)
	}
	defer safeClose(conn)
	fmt.Println("✅ DB connected")

	// 2) Init repos & handlers
	catRepo := repository.NewCategoryRepository(conn)
	catHandler := handlers.NewCategoryHandler(catRepo)

	// 3) Router sederhana
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
	mux.HandleFunc("/categories", catHandler.ListCategories)

	// 4) Tambah CORS untuk akses dari frontend
	handler := middleware.CORS(mux)

	log.Println("HTTP server on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func safeClose(c *sql.DB) {
	if c != nil {
		_ = c.Close()
	}
}
