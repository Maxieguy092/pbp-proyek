package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
)

type Product struct {
	ID          int64    `json:"id"`
	Name        string   `json:"name"`
	Price       float64  `json:"price"`
	Category    string   `json:"category"`
	ImageURL    string   `json:"imageUrl"`
	Images      []string `json:"images"`
	Sizes       []string `json:"sizes"`
	Stock       int      `json:"stock"`
	Description string   `json:"description"`
}

func GetProducts(c *gin.Context) {
	category := c.Query("category")

	query := `
		SELECT product_id, name, price, category, image_url, images, sizes, stock, description
		FROM products
	`
	args := []any{}
	if category != "" {
		query += " WHERE category = ?"
		args = append(args, category)
	}

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db query error"})
		return
	}
	defer rows.Close()

	var out []Product
	for rows.Next() {
		var p Product
		var imagesJSON, sizesJSON sql.NullString
		if err := rows.Scan(
			&p.ID, &p.Name, &p.Price, &p.Category, &p.ImageURL,
			&imagesJSON, &sizesJSON, &p.Stock, &p.Description,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan error"})
			return
		}
		if imagesJSON.Valid {
			_ = json.Unmarshal([]byte(imagesJSON.String), &p.Images)
		}
		if sizesJSON.Valid {
			_ = json.Unmarshal([]byte(sizesJSON.String), &p.Sizes)
		}
		out = append(out, p)
	}
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "rows error"})
		return
	}

	c.JSON(http.StatusOK, out)
}

func GetProductByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var p Product
	var imagesJSON, sizesJSON sql.NullString
	err = db.DB.QueryRow(`
		SELECT product_id, name, price, category, image_url, images, sizes, stock, description
		FROM products
		WHERE product_id = ?
	`, id).Scan(
		&p.ID, &p.Name, &p.Price, &p.Category, &p.ImageURL,
		&imagesJSON, &sizesJSON, &p.Stock, &p.Description,
	)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	if imagesJSON.Valid {
		_ = json.Unmarshal([]byte(imagesJSON.String), &p.Images)
	}
	if sizesJSON.Valid {
		_ = json.Unmarshal([]byte(sizesJSON.String), &p.Sizes)
	}

	c.JSON(http.StatusOK, p)
}
