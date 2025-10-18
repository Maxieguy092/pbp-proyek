package controllers

import (
	"encoding/json" // Impor package JSON
	"net/http"
	"sort"
	"strings"
	"time"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
)

// Struct ini akan kita gunakan sebagai format respons untuk daftar pesanan pengguna.
type UserOrderItem struct {
	Name     string  `json:"name"`
	ImageURL string  `json:"imageUrl"`
	Qty      int     `json:"qty"`
	Price    float64 `json:"price"`
}

type UserOrderDetail struct {
	ID             int             `json:"id"`
	Date           string          `json:"date"`
	Status         string          `json:"status"`
	Total          float64         `json:"total"`
	ShippingName   string          `json:"shippingName"`
	ShippingEmail  string          `json:"shippingEmail"`
	PaymentOption  string          `json:"paymentOption"`
	Items          []UserOrderItem `json:"items"`
	ShippingPhone  string          `json:"shippingPhone"`
	PaymentDetails string          `json:"paymentDetails"`
	AddressText    string          `json:"addressText"`
}

// GetUserOrders: Mengambil riwayat pesanan untuk user yang sedang login.
func GetUserOrders(c *gin.Context) {
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userID, _ := userIDInterface.(int)

	// 1. Query diubah untuk mengambil kolom baru:
	// o.address_text, o.shipping_phone, o.payment_details
	query := `
		SELECT 
			o.id, o.created_at, o.status, o.total, 
			o.shipping_name, o.shipping_email, o.payment_option,
			o.address_text, o.shipping_phone, o.payment_details,
			oi.qty, p.name, p.image_url, p.price
		FROM orders o
		JOIN order_items oi ON o.id = oi.order_id
		JOIN products p ON oi.product_id = p.id
		WHERE o.user_id = ?
		ORDER BY o.created_at DESC, o.id
	`
	rows, err := db.DB.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		return
	}
	defer rows.Close()

	ordersMap := make(map[int]*UserOrderDetail)
	for rows.Next() {
		var orderID int
		var createdAt time.Time
		// 2. Deklarasikan variabel baru untuk menampung data
		var status, shippingName, shippingEmail, paymentOption, productName, productImageUrl, addressText, shippingPhone, paymentDetails string
		var total, productPrice float64
		var productQty int

		// 3. Sesuaikan urutan Scan dengan urutan SELECT di query
		err := rows.Scan(
			&orderID, &createdAt, &status, &total,
			&shippingName, &shippingEmail, &paymentOption,
			&addressText, &shippingPhone, &paymentDetails,
			&productQty, &productName, &productImageUrl, &productPrice,
		)
		if err != nil {
			continue
		}

		if _, ok := ordersMap[orderID]; !ok {
			ordersMap[orderID] = &UserOrderDetail{
				ID:            orderID,
				Date:          createdAt.Format("02 Jan 2006"),
				Status:        status,
				Total:         total,
				ShippingName:  shippingName,
				ShippingEmail: shippingEmail,
				PaymentOption: paymentOption,
				Items:         make([]UserOrderItem, 0),
				// 4. Masukkan data baru ke dalam struct
				AddressText:    addressText,
				ShippingPhone:  shippingPhone,
				PaymentDetails: paymentDetails,
			}
		}

		ordersMap[orderID].Items = append(ordersMap[orderID].Items, UserOrderItem{
			Name:     productName,
			ImageURL: productImageUrl,
			Qty:      productQty,
			Price:    productPrice,
		})
	}
	
	ordersList := make([]UserOrderDetail, 0, len(ordersMap))
	// Gunakan loop `for _, order := range ordersMap` yang aman untuk pointer
	ids := make([]int, 0, len(ordersMap))
	for id := range ordersMap {
		ids = append(ids, id)
	}
	// Sortir untuk memastikan urutan konsisten
	sort.Slice(ids, func(i, j int) bool {
		return ids[i] > ids[j] // Urutkan dari ID terbesar (terbaru)
	})

	for _, id := range ids {
		ordersList = append(ordersList, *ordersMap[id])
	}

	c.JSON(http.StatusOK, ordersList)
}

// Struct untuk daftar pesanan di halaman OrderManagement
// (Tidak ada perubahan di sini)
type OrderListItem struct {
	ID       int     `json:"id"`
	Customer string  `json:"customer"`
	Total    float64 `json:"total"`
	Address  string  `json:"address"` // Hanya alamat singkat
	Status   string  `json:"status"`
	Date     string  `json:"date"`
}

// Struct untuk item di halaman OrderDetail
// (Tidak ada perubahan di sini)
type OrderItemDetail struct {
	Product string  `json:"product"`
	Qty     int     `json:"qty"`
	Price   float64 `json:"price"`
}

// Struct untuk detail lengkap pesanan
// DIUBAH: Menambahkan field baru untuk informasi pengiriman dan pembayaran
type OrderDetailResponse struct {
	ID             int               `json:"id"`
	Date           string            `json:"date"`
	CustomerName   string            `json:"name"`
	CustomerEmail  string            `json:"email"`
	Address        string            `json:"address"` // Ini akan menjadi string JSON
	Status         string            `json:"status"`
	Items          []OrderItemDetail `json:"items"`
	Total          float64           `json:"total"`
	ShippingName   string            `json:"shippingName"`
	ShippingEmail  string            `json:"shippingEmail"`
	ShippingPhone  string            `json:"shippingPhone"`
	ShippingOption string            `json:"shippingOption"`
	PaymentOption  string            `json:"paymentOption"`
	PaymentDetails string            `json:"paymentDetails"`
}

type CreateOrderRequest struct {
	// Informasi Pengiriman & Kontak
	ShippingName   string `json:"shippingName"`
	ShippingEmail  string `json:"shippingEmail"`
	ShippingPhone  string `json:"shippingPhone"`
	ShippingOption string `json:"shippingOption"`
	
	// Informasi Pembayaran
	PaymentOption  string `json:"paymentOption"`
	PaymentDetails string `json:"paymentDetails"`

	// Alamat lengkap dalam format JSON string
	AddressText    string `json:"addressText"`

	// Detail item dari keranjang
	Items []struct {
		ID    int     `json:"id"`
		Qty   int     `json:"qty"`
		Price float64 `json:"price"`
		Variant string  `json:"variant"`
	} `json:"items"`

	// Total harga
	Total float64 `json:"total"`
}


func CreateOrder(c *gin.Context) {
	// Ambil userID dari middleware
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	userID, ok := userIDInterface.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type in session"})
		return
	}

	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data: " + err.Error()})
		return
	}

	// (Validasi lainnya tetap sama)
	if strings.TrimSpace(req.ShippingName) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Shipping name is required"})
		return
	}
	if strings.TrimSpace(req.ShippingEmail) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Shipping email is required"})
		return
	}
	if strings.TrimSpace(req.ShippingPhone) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Shipping phone is required"})
		return
	}
	if len(req.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order must contain at least one item"})
		return
	}

	// Memulai transaksi database
	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// 1. INSERT ke tabel 'orders' (Sama seperti sebelumnya)
	queryOrder := `
		INSERT INTO orders 
		(user_id, total, shipping_name, shipping_email, shipping_phone, status, shipping_option, payment_option, payment_details, address_text)
		VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)
	`
	res, err := tx.Exec(queryOrder, userID, req.Total, req.ShippingName, req.ShippingEmail, req.ShippingPhone, req.ShippingOption, req.PaymentOption, req.PaymentDetails, req.AddressText)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	orderID, _ := res.LastInsertId()

	// =========================================================================
	// BLOK BARU: LOGIKA PENGURANGAN STOK
	// =========================================================================
	for _, item := range req.Items {
		// Langkah A: Ambil data stok saat ini dari DB dan kunci barisnya agar tidak diubah oleh transaksi lain
		var currentSizesJSON string
		var currentTotalStock int
		err := tx.QueryRow("SELECT sizes, stock FROM products WHERE id = ? FOR UPDATE", item.ID).Scan(&currentSizesJSON, &currentTotalStock)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": "Product with ID " + string(rune(item.ID)) + " not found"})
			return
		}

		// Langkah B: Unmarshal JSON sizes menjadi slice of struct
		var sizes []SizeOption
		if err := json.Unmarshal([]byte(currentSizesJSON), &sizes); err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse product sizes"})
			return
		}

		// Langkah C: Cari varian yang cocok, cek stok, dan kurangi
		variantFound := false
		newTotalStock := 0
		for i := range sizes {
			if sizes[i].Size == item.Variant {
				variantFound = true
				if sizes[i].Stock < item.Qty {
					// Jika stok tidak cukup, batalkan semua transaksi
					tx.Rollback()
					c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for product variant " + item.Variant})
					return
				}
				// Kurangi stok untuk varian ini
				sizes[i].Stock -= item.Qty
			}
			// Hitung ulang total stok dari semua varian
			newTotalStock += sizes[i].Stock
		}

		if !variantFound {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Variant " + item.Variant + " not found for product"})
			return
		}

		// Langkah D: Marshal kembali slice yang sudah diupdate ke JSON
		updatedSizesJSON, err := json.Marshal(sizes)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize product sizes"})
			return
		}

		// Langkah E: Update data stok di tabel products
		_, err = tx.Exec("UPDATE products SET sizes = ?, stock = ? WHERE id = ?", string(updatedSizesJSON), newTotalStock, item.ID)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product stock"})
			return
		}

		// Langkah F: Masukkan item ke order_items (setelah stok dipastikan aman)
		queryItem := `
			INSERT INTO order_items (order_id, product_id, price, qty, subtotal)
			VALUES (?, ?, ?, ?, ?)
		`
		subtotal := item.Price * float64(item.Qty)
		_, err = tx.Exec(queryItem, orderID, item.ID, item.Price, item.Qty, subtotal)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save order items"})
			return
		}
	}
	// =========================================================================
	// AKHIR BLOK PENGURANGAN STOK
	// =========================================================================

	// (Opsional) Kosongkan keranjang (Sama seperti sebelumnya)
	// tx.Exec("DELETE FROM cart_items WHERE ...")

	// Jika semua berhasil, commit transaksi
	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order created successfully",
		"orderId": orderID,
	})
}

// GetOrders: Mengambil semua pesanan untuk OrderManagement
// (Tidak ada perubahan di sini)
func GetOrders(c *gin.Context) {
	query := `
		SELECT 
			o.id,
			CONCAT(u.first_name, ' ', u.last_name) as customer,
			o.total,
			o.address_text,
			o.status,
			DATE_FORMAT(o.created_at, '%d %b %Y') as date
		FROM orders o
		JOIN users u ON o.user_id = u.id
		ORDER BY o.created_at DESC
	`
	rows, err := db.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		return
	}
	defer rows.Close()

	var orders []OrderListItem
	for rows.Next() {
		var order OrderListItem
		var addressJSON string
		if err := rows.Scan(&order.ID, &order.Customer, &order.Total, &addressJSON, &order.Status, &order.Date); err != nil {
			continue
		}

		var addrData map[string]string
		if json.Unmarshal([]byte(addressJSON), &addrData) == nil {
			order.Address = addrData["street"]
		} else {
			order.Address = "Alamat tidak valid"
		}

		orders = append(orders, order)
	}
	c.JSON(http.StatusOK, orders)
}

// GetOrderByID: Mengambil detail satu pesanan
// DIUBAH: Query dan Scan disesuaikan untuk mengambil data baru
func GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	var order OrderDetailResponse

	// Query untuk data utama pesanan, sudah ditambahkan kolom baru
	queryOrder := `
		SELECT 
			o.id,
			DATE_FORMAT(o.created_at, '%d %M %Y') as date,
			CONCAT(u.first_name, ' ', u.last_name) as name,
			u.email,
			o.address_text,
			o.status,
			o.total,
			o.shipping_name,
			o.shipping_email,
			o.shipping_phone,
			o.shipping_option,
			o.payment_option,
			o.payment_details
		FROM orders o
		JOIN users u ON o.user_id = u.id
		WHERE o.id = ?
	`
	// Sesuaikan urutan Scan dengan urutan SELECT di query
	err := db.DB.QueryRow(queryOrder, id).Scan(
		&order.ID,
		&order.Date,
		&order.CustomerName,
		&order.CustomerEmail,
		&order.Address,
		&order.Status,
		&order.Total,
		&order.ShippingName,
		&order.ShippingEmail,
		&order.ShippingPhone,
		&order.ShippingOption,
		&order.PaymentOption,
		&order.PaymentDetails,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Query untuk item-item dalam pesanan (tidak ada perubahan di sini)
	queryItems := `
		SELECT p.name, oi.qty, oi.price
		FROM order_items oi
		JOIN products p ON oi.product_id = p.id
		WHERE oi.order_id = ?
	`
	rows, _ := db.DB.Query(queryItems, id)
	defer rows.Close()
	for rows.Next() {
		var item OrderItemDetail
		rows.Scan(&item.Product, &item.Qty, &item.Price)
		order.Items = append(order.Items, item)
	}

	c.JSON(http.StatusOK, order)
}

// UpdateOrderStatus: Mengubah status pesanan
// (Tidak ada perubahan di sini)
func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Status string `json:"status"`
	}
	if c.ShouldBindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := db.DB.Exec("UPDATE orders SET status = ? WHERE id = ?", body.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}