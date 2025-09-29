package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		dbUser, dbPass, dbHost, dbPort, dbName)

	var err error

	// Retry up to 10 times (30s total)
	for i := 0; i < 10; i++ {
		DB, err = sql.Open("mysql", dsn)
		if err == nil {
			err = DB.Ping()
		}
		if err == nil {
			fmt.Println("Connection Established:", dbName)
			return
		}
		fmt.Println("Waiting for DB... retrying in 3s")
		time.Sleep(3 * time.Second)
	}

	log.Fatalf("Could not connect to DB after retries: %v", err)
}
