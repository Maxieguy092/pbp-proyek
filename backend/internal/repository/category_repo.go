package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/Maxiegame092/pbp-app/internal/models"
)

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

// ListCategories: ambil daftar kategori dengan pagination sederhana.
func (r *CategoryRepository) ListCategories(ctx context.Context, limit, offset int) ([]models.Category, error) {
	if limit <= 0 || limit > 1000 {
		limit = 50
	}
	if offset < 0 {
		offset = 0
	}

	const q = `
		SELECT id, name
		FROM categories
		ORDER BY id ASC
		LIMIT ? OFFSET ?;
	`

	cctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	rows, err := r.db.QueryContext(cctx, q, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]models.Category, 0, limit)
	for rows.Next() {
		var c models.Category
		if err := rows.Scan(&c.ID, &c.Name); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

// Count: total baris untuk meta pagination.
func (r *CategoryRepository) Count(ctx context.Context) (int64, error) {
	cctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var total int64
	if err := r.db.QueryRowContext(cctx, `SELECT COUNT(*) FROM categories`).Scan(&total); err != nil {
		return 0, err
	}
	return total, nil
}
