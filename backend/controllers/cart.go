package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
)

// Struct untuk data item yang dikirim ke frontend
type CartItem struct {
	CartItemID int     `json:"cartItemId"` // ID unik dari tabel cart_items
	ID         int     `json:"id"`         // ID produk
	Name       string  `json:"name"`
	Price      float64 `json:"price"`
	ImageURL   string  `json:"imageUrl"`
	Qty        int     `json:"qty"`
	Variant    *string `json:"variant,omitempty"`
	VariantStock int     `json:"variantStock"`
}

// Fungsi helper untuk mengambil ID user dan cart berdasarkan email dari sesi
func getOrCreateCartIDByUserID(userID int) (int, error) {
	var cartID int
	// Langsung cari cart berdasarkan userID
	err := db.DB.QueryRow("SELECT id FROM carts WHERE user_id = ?", userID).Scan(&cartID)
	
	if err == sql.ErrNoRows {
		// Jika cart tidak ada, buat yang baru
		res, err := db.DB.Exec("INSERT INTO carts (user_id) VALUES (?)", userID)
		if err != nil {
			return 0, err
		}
		newCartID, _ := res.LastInsertId()
		cartID = int(newCartID)
	} else if err != nil {
		return 0, err
	}
	return cartID, nil
}

// GET /api/cart - Mengambil isi keranjang pengguna
func GetCart(c *gin.Context) {
	// UBAH BAGIAN INI: Ambil 'user_id' dan konversi ke int
	userIDInterface, _ := c.Get("user_id")
	userID := userIDInterface.(int)

	// Gunakan fungsi helper yang baru
	cartID, err := getOrCreateCartIDByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve user cart"})
		return
	}

	rows, err := db.DB.Query(`
		SELECT 
			ci.id, p.id, p.name, p.price, p.image_url, ci.qty, ci.variant, p.sizes
		FROM cart_items ci 
		JOIN products p ON ci.product_id = p.id 
		WHERE ci.cart_id = ?
	`, cartID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch cart items"})
		return
	}
	defer rows.Close()

	items := make([]CartItem, 0)

	for rows.Next() {
		var item CartItem
		var sizesJSON sql.NullString // Variabel untuk menampung JSON sizes

		// 2. UBAH SCAN: Sesuaikan dengan query baru
		if err := rows.Scan(&item.CartItemID, &item.ID, &item.Name, &item.Price, &item.ImageURL, &item.Qty, &item.Variant, &sizesJSON); err != nil {
			continue
		}

		// 3. LOGIKA BARU: Cari stok untuk varian spesifik
		item.VariantStock = 0 // Default stok 0
		if sizesJSON.Valid && item.Variant != nil {
			var sizes []SizeOption // Gunakan struct SizeOption dari products.go
			if json.Unmarshal([]byte(sizesJSON.String), &sizes) == nil {
				// Loop untuk mencari varian yang cocok
				for _, s := range sizes {
					if s.Size == *item.Variant {
						item.VariantStock = s.Stock // Ditemukan, set stoknya
						break
					}
				}
			}
		}

		items = append(items, item)
	}
	
	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating cart items"})
		return
	}
	
	c.JSON(http.StatusOK, items)
}



// POST /api/cart/items - Menambah item ke keranjang
func AddItemToCart(c *gin.Context) {
	userIDInterface, _ := c.Get("user_id")
	userID := userIDInterface.(int)
	cartID, err := getOrCreateCartIDByUserID(userID)
	if err != nil { /* ... */ }

	// UBAH: Tambahkan field Variant di struct request
	var req struct {
		ProductID int    `json:"productId"`
		Qty       int    `json:"qty"`
		Variant   string `json:"variant"` // <-- TAMBAHKAN INI
	}
	if err := c.ShouldBindJSON(&req); err != nil { /* ... */ }

	// UBAH: Cek item berdasarkan product_id DAN variant
	var currentQty int
	err = db.DB.QueryRow(
		"SELECT qty FROM cart_items WHERE cart_id = ? AND product_id = ? AND variant = ?",
		cartID, req.ProductID, req.Variant,
	).Scan(&currentQty)

	if err == sql.ErrNoRows {
		// UBAH: Sertakan variant saat INSERT
		_, err = db.DB.Exec(
			"INSERT INTO cart_items (cart_id, product_id, qty, variant) VALUES (?, ?, ?, ?)",
			cartID, req.ProductID, req.Qty, req.Variant,
		)
	} else {
		// UBAH: Sertakan variant di klausa WHERE saat UPDATE
		_, err = db.DB.Exec(
			"UPDATE cart_items SET qty = qty + ? WHERE cart_id = ? AND product_id = ? AND variant = ?",
			req.Qty, cartID, req.ProductID, req.Variant,
		)
	}

	if err != nil { /* ... */ }
	GetCart(c)
}

// PUT /api/cart/items/:id - Mengubah kuantitas item
func UpdateCartItem(c *gin.Context) {
	cartItemID := c.Param("id")
	var req struct {
		Qty int `json:"qty"`
	}
	if err := c.ShouldBindJSON(&req); err != nil { /* ... */ }
    
    // VALIDASI KUANTITAS MINIMUM
    if req.Qty <= 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity must be positive"})
        return
    }

	// 1. Ambil detail item dari DB untuk mendapatkan product_id dan variant
	var productID int
	var variant sql.NullString
	err := db.DB.QueryRow("SELECT product_id, variant FROM cart_items WHERE id = ?", cartItemID).Scan(&productID, &variant)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// 2. Ambil data 'sizes' dari produk terkait
	var sizesJSON sql.NullString
	err = db.DB.QueryRow("SELECT sizes FROM products WHERE id = ?", productID).Scan(&sizesJSON)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// 3. Cari stok spesifik untuk varian tersebut
	variantStock := 0
	if sizesJSON.Valid && variant.Valid {
		var sizes []SizeOption
		if json.Unmarshal([]byte(sizesJSON.String), &sizes) == nil {
			for _, s := range sizes {
				if s.Size == variant.String {
					variantStock = s.Stock
					break
				}
			}
		}
	}

	// 4. LAKUKAN VALIDASI STOK
	if req.Qty > variantStock {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot add more items than available stock"})
		return
	}

	// 5. Jika validasi lolos, baru update kuantitas
	_, err = db.DB.Exec("UPDATE cart_items SET qty = ? WHERE id = ?", req.Qty, cartItemID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item quantity"})
		return
	}
	
    GetCart(c) // Kirim kembali data keranjang yang sudah diperbarui
}

// DELETE /api/cart/items/:id - Menghapus item dari keranjang
func DeleteCartItem(c *gin.Context) {
	cartItemID := c.Param("id")
	_, err := db.DB.Exec("DELETE FROM cart_items WHERE id = ?", cartItemID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item from cart"})
		return
	}
	GetCart(c)
}

// DELETE /api/cart - Mengosongkan keranjang
func ClearCart(c *gin.Context) {
	// UBAH BAGIAN INI: Ambil 'user_id' dan konversi ke int
	userIDInterface, _ := c.Get("user_id")
	userID := userIDInterface.(int)
	
	// Gunakan fungsi helper yang baru
	cartID, err := getOrCreateCartIDByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not process user cart"})
		return
	}

	_, err = db.DB.Exec("DELETE FROM cart_items WHERE cart_id = ?", cartID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear cart"})
		return
	}
    
	c.JSON(http.StatusOK, []CartItem{})
}