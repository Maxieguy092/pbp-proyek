package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"fmt"
	"time"

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
	fmt.Println("➡️ Mulai GetProducts")

	category := c.Query("category")

	query := `
    SELECT p.id, p.name, p.price, IFNULL(c.name, '') as category, p.image_url, p.images, p.sizes, p.stock, p.description
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
	`
	args := []any{}
	if category != "" {
			query += " WHERE c.name = ?"
			args = append(args, category)
	}

	fmt.Println("📡 Query:", query)

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		fmt.Println("❌ DB Query error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db query error"})
		return
	}
	defer rows.Close()

	fmt.Println("✅ Query jalan, mulai iterasi")
	var out []Product
	for rows.Next() {
		var p Product
		var imagesJSON, sizesJSON sql.NullString
		if err := rows.Scan(
			&p.ID, &p.Name, &p.Price, &p.Category, &p.ImageURL,
			&imagesJSON, &sizesJSON, &p.Stock, &p.Description,
		); err != nil {
			fmt.Println("❌ Scan error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan error"})
			return
		}
		if imagesJSON.Valid {
			if err := json.Unmarshal([]byte(imagesJSON.String), &p.Images); err != nil {
				fmt.Println("⚠️ JSON unmarshal images error:", err)
			}
		}
		if sizesJSON.Valid {
			if err := json.Unmarshal([]byte(sizesJSON.String), &p.Sizes); err != nil {
				fmt.Println("⚠️ JSON unmarshal sizes error:", err)
			}
		}
		out = append(out, p)
	}
	fmt.Println("✅ Selesai iterasi, kirim JSON")
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
    name := c.PostForm("name")
    category := c.PostForm("category_id")
    priceStr := c.PostForm("price")
    stockStr := c.PostForm("stock")
    description := c.PostForm("description")

    price, _ := strconv.ParseFloat(priceStr, 64)
    stock, _ := strconv.Atoi(stockStr)

    // Ambil file-file baru
    form, _ := c.MultipartForm()
    files := form.File["images"]

    var uploadedPaths []string
    for _, file := range files {
        filename := strconv.FormatInt(time.Now().UnixNano(), 10) + "_" + file.Filename
        savePath := "./images/" + filename
        if err := c.SaveUploadedFile(file, savePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        uploadedPaths = append(uploadedPaths, "http://localhost:5000/images/"+filename)
    }

    // Ambil existing images (kalau ada)
    existingImages := c.PostFormArray("existingImages")
    allImages := append(existingImages, uploadedPaths...)

    // Masukkan ke DB
    imagesJSON, _ := json.Marshal(allImages)

    query := `
        INSERT INTO products (name, price, category_id, image_url, images, stock, description)
        VALUES (?, ?, (SELECT id FROM categories WHERE id = ? LIMIT 1), ?, ?, ?, ?)
    `
    res, err := db.DB.Exec(query,
        name, price, category,
        allImages[0], // set image_url dari gambar pertama
        string(imagesJSON), stock, description,
    )
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    id, _ := res.LastInsertId()
	// Ambil nama kategori dari DB
	var categoryName string
	err = db.DB.QueryRow("SELECT name FROM categories WHERE id = ? OR name = ? LIMIT 1", category, category).Scan(&categoryName)
	if err != nil {
		categoryName = "Unknown"
	}

    c.JSON(http.StatusCreated, gin.H{
    "id":          id,
    "name":        name,
    "price":       price,
    "stock":       stock,
    "category":    categoryName,
    "description": description,
    "images":      allImages,
    })
}



func UpdateProduct(c *gin.Context) {
    idStr := c.Param("id")
    id, _ := strconv.ParseInt(idStr, 10, 64)

    name := c.PostForm("name")
    category := c.PostForm("category_id")
    priceStr := c.PostForm("price")
    stockStr := c.PostForm("stock")
    description := c.PostForm("description")

    price, _ := strconv.ParseFloat(priceStr, 64)
    stock, _ := strconv.Atoi(stockStr)

    form, _ := c.MultipartForm()
    files := form.File["images"]

    var uploadedPaths []string
    for _, file := range files {
        filename := strconv.FormatInt(time.Now().UnixNano(), 10) + "_" + file.Filename
        savePath := "./images/" + filename
        if err := c.SaveUploadedFile(file, savePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        uploadedPaths = append(uploadedPaths, "http://localhost:5000/images/"+filename)
    }

    // Ambil existingImages dari form
    existingImages := c.PostFormArray("existingImages")
    allImages := append(existingImages, uploadedPaths...)

    imagesJSON, _ := json.Marshal(allImages)

    query := `
        UPDATE products
        SET name = ?, price = ?, category_id = (SELECT id FROM categories WHERE id = ? LIMIT 1),
            image_url = ?, images = ?, stock = ?, description = ?
        WHERE id = ?
    `
    _, err := db.DB.Exec(query,
        name, price, category, allImages[0], string(imagesJSON), stock, description, id,
    )
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "✅ Produk berhasil diperbarui", "images": allImages})
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
