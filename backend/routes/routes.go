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
		api.POST("/register", controllers.Register) // <-- INI PERUBAHANNYA
		api.POST("/logout", controllers.Logout)

		// Rute untuk produk
		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)

		// api.GET("/admin/orders", controllers.GetOrders)
		// api.GET("/admin/orders/:id", controllers.GetOrderByID)
		// api.PUT("/admin/orders/:id/status", controllers.UpdateOrderStatus)

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
		}

		// Rute untuk health check
		api.GET("/healthz", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"ok": true})
		})
	}

	// ✅ Admin-only group
	admin := api.Group("/admin")
	admin.Use(controllers.RequireAdmin())
	{

		admin.GET("/orders", controllers.GetOrders)
		admin.GET("/orders/:id", controllers.GetOrderByID)
		admin.PUT("/orders/:id/status", controllers.UpdateOrderStatus)
		admin.POST("/products", controllers.CreateProduct)
		admin.PUT("/products/:id", controllers.UpdateProduct)
		admin.DELETE("/products/:id", controllers.DeleteProduct)
		admin.GET("/check-session", controllers.CheckAdminSession)

		// You can add more admin endpoints here
		admin.GET("/dashboard", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Welcome Admin"})
		})
	}
}
