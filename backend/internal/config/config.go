package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	Host   string
	Port   string
	Name   string
	User   string
	Pass   string
	Params string
}

func Load() DBConfig {
	// Saat dev, coba load .env; jika tidak ada, lanjut pakai os.Getenv
	_ = godotenv.Load(".env")

	cfg := DBConfig{
		Host:   getenv("DB_HOST", "127.0.0.1"),
		Port:   getenv("DB_PORT", "3306"),
		Name:   getenv("DB_NAME", "mini_commerce"),
		User:   getenv("DB_USER", "app_user"),
		Pass:   getenv("DB_PASS", ""),
		Params: getenv("DB_PARAMS", "parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci&loc=Local"),
	}

	// Validasi minimal
	if cfg.Pass == "" {
		log.Println("[warn] DB_PASS kosong—pastikan variabel environment sudah diset")
	}
	return cfg
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
