package controllers

import (
	"encoding/json" // Impor package JSON
	"net/http"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/gin-gonic/gin"
)

// Struct untuk daftar pesanan di halaman OrderManagement
type OrderListItem struct {
	ID       int     `json:"id"`
	Customer string  `json:"customer"`
	Total    float64 `json:"total"`
	Address  string  `json:"address"` // Hanya alamat singkat
	Status   string  `json:"status"`
	Date     string  `json:"date"`
}

// Struct untuk item di halaman OrderDetail
type OrderItemDetail struct {
	Product string  `json:"product"`
	Qty     int     `json:"qty"`
	Price   float64 `json:"price"`
}

// Struct untuk detail lengkap pesanan
type OrderDetailResponse struct {
	ID      int               `json:"id"`
	Date    string            `json:"date"`
	CustomerName string       `json:"name"`
	CustomerEmail string      `json:"email"`
	Address string            `json:"address"` // Ini akan menjadi string JSON
	Status  string            `json:"status"`
	Items   []OrderItemDetail `json:"items"`
	Total   float64           `json:"total"`
}


// GetOrders: Mengambil semua pesanan untuk OrderManagement
func GetOrders(c *gin.Context) {
	// Query ini menggabungkan data dari tabel orders dan users
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
		var addressJSON string // Tampung data JSON dari DB
		if err := rows.Scan(&order.ID, &order.Customer, &order.Total, &addressJSON, &order.Status, &order.Date); err != nil {
			continue
		}

		// Ambil hanya jalan dari JSON untuk ditampilkan di daftar
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
func GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	var order OrderDetailResponse

	// Query untuk data utama pesanan
	queryOrder := `
		SELECT 
			o.id,
			DATE_FORMAT(o.created_at, '%d %M %Y') as date,
			CONCAT(u.first_name, ' ', u.last_name) as name,
			u.email,
			o.address_text,
			o.status,
			o.total
		FROM orders o
		JOIN users u ON o.user_id = u.id
		WHERE o.id = ?
	`
	err := db.DB.QueryRow(queryOrder, id).Scan(&order.ID, &order.Date, &order.CustomerName, &order.CustomerEmail, &order.Address, &order.Status, &order.Total)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Query untuk item-item dalam pesanan
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