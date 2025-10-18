package routes

import (
	"net/http"

	"github.com/Maxiegame092/pbp-app/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Rute untuk autentikasi
		api.POST("/login", controllers.Login)
		api.POST("/register", controllers.Register) // <-- INI PERUBAHANNYA
		api.POST("/logout", controllers.Logout)
		api.GET("/me", controllers.CheckSession)

		// Rute untuk health check
		api.GET("/healthz", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"ok": true})
		})
	}

	// ✅ Admin-only group
	admin := api.Group("/admin")
	admin.Use(controllers.RequireAdmin())
	{
		admin.POST("/products", controllers.CreateProduct)
		admin.PUT("/products/:id", controllers.UpdateProduct)
		admin.DELETE("/products/:id", controllers.DeleteProduct)

		// You can add more admin endpoints here
		admin.GET("/dashboard", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Welcome Admin"})
		})
	}
}
