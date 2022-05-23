package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
)

type any interface{}

func DispatchSocket(server *socketio.Server) {
	err := server.Serve()
	if err != nil {
		log.Fatalf("SocketIO listen error: %s\n", err)
	}
}

func RouteServer(router *gin.Engine, server *socketio.Server) {
	url := "/socket.io/*any"
	router.GET(url, gin.WrapH(server))
	router.POST(url, gin.WrapH(server))
}

func HandleSocketConnection(s socketio.Conn) error {
	s.SetContext("")
	log.Println("connected:", s.ID())
	return nil
}

func CreateGameWithHostname(s socketio.Conn, hostname string) {
	s.Emit("create_game_with_hostname_response", hostname)
}

func main() {
	router := gin.Default()
	server := socketio.NewServer(nil)

	// server.OnConnect("/", HandleSocketConnection)
	server.OnConnect("/", func(s socketio.Conn) error {
		s.Emit("connected", "")
		log.Println("connected:", s.ID())
		return nil
	})

	// server.OnEvent("/", "create_game_with_hostname", CreateGameWithHostname)

	server.OnError("/", func(_ socketio.Conn, e error) {
		log.Println("meet error:", e)
	})

	server.OnDisconnect("/", func(_ socketio.Conn, reason string) {
		log.Println("closed", reason)
	})

	go DispatchSocket(server)

	router.GET("/socket.io/*any", gin.WrapH(server))
	router.POST("/socket.io/*any", gin.WrapH(server))

	// RouteServer(router, server)

	router.LoadHTMLFiles("./dist/index.html")
	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.Static("/assets", "./dist/assets/")

	router.Run("localhost:8080")
}
