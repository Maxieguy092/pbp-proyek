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
		api.POST("/login", controllers.Login)
		api.POST("/register", controllers.Register)  
		api.POST("/logout", controllers.Logout)

		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)

		auth := api.Group("/")
		auth.Use(middleware.AuthMiddleware())
		{
			auth.GET("/me", controllers.CheckSession)

			auth.GET("/cart", controllers.GetCart)
			auth.POST("/cart/items", controllers.AddItemToCart)
			auth.PUT("/cart/items/:id", controllers.UpdateCartItem)
			auth.DELETE("/cart/items/:id", controllers.DeleteCartItem)
			auth.DELETE("/cart", controllers.ClearCart)	
			auth.POST("/orders", controllers.CreateOrder)
			auth.GET("/my-orders", controllers.GetUserOrders)
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

		api.GET("/healthz", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"ok": true})
		})
	}

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

		admin.GET("/dashboard", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Welcome Admin"})
		})
	}
}
