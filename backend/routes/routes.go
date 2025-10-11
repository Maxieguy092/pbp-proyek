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

		// Rute untuk produk
		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)
		api.POST("/products", controllers.CreateProduct)
		api.PUT("/products/:id", controllers.UpdateProduct) 
		api.DELETE("/products/:id", controllers.DeleteProduct)


		// Rute untuk health check
		api.GET("/healthz", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"ok": true})
		})
	}
}