package routes

import (
	"net/http"

	"github.com/Maxiegame092/pbp-app/controllers"
	"github.com/Maxiegame092/pbp-app/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Rute untuk autentikasi
		api.POST("/login", controllers.Login)
		api.POST("/register", controllers.Register) 
		api.POST("/logout", controllers.Logout)

		// Rute untuk produk
		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)

		api.GET("/admin/orders", controllers.GetOrders)
		api.GET("/admin/orders/:id", controllers.GetOrderByID)
		api.PUT("/admin/orders/:id/status", controllers.UpdateOrderStatus)

		// Grup route yang dilindungi otentikasi
		auth := api.Group("/")
		auth.Use(middleware.AuthMiddleware())
		{
			// Endpoint untuk profil
			auth.GET("/me", controllers.CheckSession)

			// Endpoint untuk keranjang
			auth.GET("/cart", controllers.GetCart)
			auth.POST("/cart/items", controllers.AddItemToCart)
			auth.PUT("/cart/items/:id", controllers.UpdateCartItem)
			auth.DELETE("/cart/items/:id", controllers.DeleteCartItem)
			auth.DELETE("/cart", controllers.ClearCart)	
			auth.POST("/orders", controllers.CreateOrder)
			auth.GET("/check-auth", func(c *gin.Context) {
				userID, exists := c.Get("user_id")
				if !exists {
					c.JSON(http.StatusUnauthorized, gin.H{
						"status": "gagal",
						"pesan":  "Middleware tidak menemukan user_id di dalam konteks.",
					})
					return
				}
				c.JSON(http.StatusOK, gin.H{
					"status":  "sukses",
					"user_id": userID,
				})
			})
		}

		// Rute untuk health check
		api.GET("/healthz", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"ok": true})
		})
	}
}