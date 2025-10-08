package routes

import (
	"net/http"

	"github.com/Maxiegame092/pbp-app/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Panggil controller Gin secara langsung
		api.POST("/login", controllers.Login)
		api.POST("/register", func(c *gin.Context) { controllers.Register(c.Writer, c.Request) })
		api.POST("/logout", controllers.Logout)
		api.GET("/me", controllers.CheckSession)

		// Rute lainnya
		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)
		api.GET("/healthz", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"ok": true})
		})
	}
}