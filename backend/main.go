package main

import (
	"log"

	db "github.com/Maxiegame092/pbp-app/DB"
	"github.com/Maxiegame092/pbp-app/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
    db.InitDB()  

    r := gin.Default()
    

    r.Static("/images", "./images")
    r.Static("/api/images", "./images")
    
    
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
    }))

    routes.SetupRoutes(r)

    if err := r.Run(":5000"); err != nil {
        log.Fatal(err)
    }
}

