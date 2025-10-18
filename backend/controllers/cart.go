package controllers

import (
	"database/sql"
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
	Stock      int     `json:"stock"`
	Variant    *string `json:"variant,omitempty"`
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
			ci.id, p.id, p.name, p.price, p.image_url, ci.qty, p.stock, ci.variant
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
		if err := rows.Scan(&item.CartItemID, &item.ID, &item.Name, &item.Price, &item.ImageURL, &item.Qty, &item.Stock, &item.Variant); err != nil {
			continue
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
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := db.DB.Exec("UPDATE cart_items SET qty = ? WHERE id = ?", req.Qty, cartItemID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item quantity"})
		return
	}
	GetCart(c)
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