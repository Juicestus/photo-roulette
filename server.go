package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type any interface{}

func main() {
	router := gin.Default()
	router.LoadHTMLFiles("./dist/index.html")
	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	//router.GET("/api", directory.ResolvePage)
	router.Static("/assets", "./dist/assets/")

	router.Run("localhost:8080")
}
