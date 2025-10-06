package routes

import (
	"github.com/Maxiegame092/pbp-app/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/login", func(c *gin.Context) {
			controllers.Login(c.Writer, c.Request)
		})
		api.POST("/register", func(c *gin.Context) {
			controllers.Register(c.Writer, c.Request)
		})
		api.POST("/logout", controllers.Logout)
		api.GET("/me", func(c *gin.Context) {
			controllers.CheckSession(c.Writer, c.Request)
		})
	}

}
