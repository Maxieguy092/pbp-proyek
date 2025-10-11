package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
)

import "io"


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
    SELECT p.id, p.name, p.price, c.name as category, p.image_url, p.images, p.sizes, p.stock, p.description
    FROM products p
    JOIN categories c ON p.category_id = c.id
	`	
	args := []any{}
	if category != "" {
			query += " WHERE c.name = ?"
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
		SELECT p.id, p.name, p.price, c.name as category, p.image_url, p.images, p.sizes, p.stock, p.description
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
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



func CreateProduct(c *gin.Context) {
	var p Product
	if err := c.ShouldBindJSON(&p); err != nil {
		// 🔥 cetak error ke terminal (biar muncul di log Docker)
		println("JSON BIND ERROR:", err.Error())

		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "invalid JSON",
			"detail": err.Error(),
		})
		return
	}

	// ubah array jadi JSON string
	imagesJSON, _ := json.Marshal(p.Images)
	sizesJSON, _ := json.Marshal(p.Sizes)

	query := `
		INSERT INTO products (name, price, category_id, image_url, images, sizes, stock, description)
		VALUES (?, ?, (SELECT id FROM categories WHERE name = ? LIMIT 1), ?, ?, ?, ?, ?)
	`
	res, err := db.DB.Exec(query,
		p.Name, p.Price, p.Category, p.ImageURL,
		string(imagesJSON), string(sizesJSON), p.Stock, p.Description,
	)
	if err != nil {
		// 🔥 print juga kalau SQL error
		println("SQL ERROR:", err.Error())

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := res.LastInsertId()
	p.ID = id

	c.JSON(http.StatusCreated, p)
}



func UpdateProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var p Product
	if err := c.ShouldBindJSON(&p); err != nil {
		// 🔍 Debug log: tampilkan isi body JSON yang dikirim frontend
		body, _ := io.ReadAll(c.Request.Body)
		println("BODY:", string(body))

		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "invalid JSON",
			"detail": err.Error(),
		})
		return
	}

	// ubah array ke JSON string untuk disimpan di DB
	imagesJSON, _ := json.Marshal(p.Images)
	sizesJSON, _ := json.Marshal(p.Sizes)

	query := `
		UPDATE products
		SET name = ?, price = ?, category_id = (SELECT id FROM categories WHERE name = ? LIMIT 1),
			image_url = ?, images = ?, sizes = ?, stock = ?, description = ?
		WHERE id = ?
	`
	_, err = db.DB.Exec(query,
		p.Name, p.Price, p.Category, p.ImageURL,
		string(imagesJSON), string(sizesJSON), p.Stock, p.Description, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db update error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "product updated"})
}


func DeleteProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	res, err := db.DB.Exec("DELETE FROM products WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error", "detail": err.Error()})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "product deleted"})
}
