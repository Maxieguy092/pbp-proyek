package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/Maxiegame092/pbp-app/internal/config"
	"github.com/Maxiegame092/pbp-app/internal/db"
)

func main() {
	// 1) Load config (ambil dari .env / environment)
	cfg := config.Load()

	// 2) Connect DB
	conn, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("DB connect error: %v", err)
	}
	defer conn.Close()
	fmt.Println("✅ DB connected")

	// 3) (Opsional) uji query sederhana
	if err := testQuery(conn); err != nil {
		log.Fatalf("test query failed: %v", err)
	}

	// 4) Start HTTP server (contoh minimal)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
	log.Println("HTTP server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func testQuery(conn *sql.DB) error {
	// cek kategori ada atau tidak
	rows, err := conn.Query("SELECT id, name FROM categories LIMIT 5")
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var id uint64
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			return err
		}
		log.Printf("category: %d - %s", id, name)
	}
	return rows.Err()
}
