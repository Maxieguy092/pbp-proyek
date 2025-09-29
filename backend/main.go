package main

import (
	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/Maxiegame092/pbp-app/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func main() {
	db.InitDB()

	r := gin.Default()
	cors.Default()

	routes.SetupRoutes(r)

	r.Run(":5000")
}
