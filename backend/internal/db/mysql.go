package db

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Maxiegame092/pbp-app/internal/config"

	_ "github.com/go-sql-driver/mysql"
)

func Connect(cfg config.DBConfig) (*sql.DB, error) {
	// DSN: user:pass@tcp(host:port)/dbname?params
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s",
		cfg.User, cfg.Pass, cfg.Host, cfg.Port, cfg.Name, cfg.Params,
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	// Pooling (sesuaikan kebutuhan)
	db.SetMaxOpenConns(20)                  // koneksi maksimal ke MySQL
	db.SetMaxIdleConns(5)                   // idle connections
	db.SetConnMaxLifetime(30 * time.Minute) // hindari "MySQL server has gone away"
	db.SetConnMaxIdleTime(10 * time.Minute)

	// Ping dengan timeout
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, err
	}

	return db, nil
}
