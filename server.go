package main

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type any interface{}

func LoadHTMLDirectory(r *gin.Engine, dir string) {
	items, err := ioutil.ReadDir(dir)
	if err != nil {
		panic(err)
	}
	for _, item := range items {
		r.LoadHTMLFiles(dir + "/" + item.Name())
		log.Println(dir + "/" + item.Name())
	}
}

func CreateGame(c *gin.Context) {
}

func main() {
	router := gin.Default()
	LoadHTMLDirectory(router, "./public")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.GET("/create", func(c *gin.Context) {
		c.HTML(http.StatusOK, "create.html", nil)
	})
	router.POST("/", CreateGame)
	router.Static("/assets/src", "./src")
	router.Static("/assets/styles", "./styles")

	router.Run("localhost:8080")
}
