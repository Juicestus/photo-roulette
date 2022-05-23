package main

import (
	"crypto/sha256"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type any interface{}

func CreateJSONError(text string, code int) gin.H {
	return gin.H{"error": text, "code": code}
}

func RandInt(min, max int) int {
	return min + rand.Intn(max-min)
}

func HashString(str string) string {
	return fmt.Sprintf("%x", sha256.Sum256([]byte(str)))
}

func NewRandomString() string {
	return fmt.Sprintf("%x", sha256.Sum256([]byte(string(time.Now().Unix()))))[:32]
}

type Player struct {
	PrivateKey string
	TargetKey  string

	Name string `json:"name"`
}

func CreatePlayer(name string) (Player, string) {
	private := NewRandomString()
	public := NewRandomString()

	p := Player{
		Name:       name,
		PrivateKey: private,
		TargetKey:  HashString(private + public),
	}

	return p, public
}

type Game struct {
	Id string

	Host    Player
	Players map[string]Player
}

func CreateGame(code string, host Player) Game {
	return Game{
		Id:      code,
		Host:    host,
		Players: map[string]Player{host.Name: host},
	}
}

func (g *Game) AddPlayer(p Player) bool {
	_, found := g.Players[p.Name]
	if found {
		return false
	}
	g.Players[p.Name] = p
	return true
}

type Application struct {
	Games map[string]Game
}

func CreateApplication() *Application {
	return &Application{Games: make(map[string]Game)}
}

func (a *Application) HandleCreateGame(ctx *gin.Context) {
	hostname := ctx.Request.URL.Query()["hostname"]
	if hostname == nil {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Hostname not specified", 1))
		return
	}

	host, public := CreatePlayer(hostname[0])

	found, code := true, ""
	for found {
		code = fmt.Sprintf("%04d", RandInt(1, 9999))
		_, found = a.Games[code]
	}
	game := CreateGame(code, host)
	a.Games[game.Id] = game

	log.Println("Created game #" + game.Id)

	ctx.IndentedJSON(http.StatusOK, gin.H{
		"name":   host.Name,
		"public": public,
		"game":   game.Id,
	})
}

func (a *Application) HandleJoinGame(ctx *gin.Context) {
	code := ctx.Request.URL.Query()["code"]
	if code == nil {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Code not specified", 2))
		return
	}

	game, ok := a.Games[code[0]]
	if !ok {
		ctx.IndentedJSON(http.StatusNotFound, CreateJSONError("Game not found", 3))
		return
	}

	name := ctx.Request.URL.Query()["name"]
	if name == nil {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Name not specified", 4))
		return
	}

	player, public := CreatePlayer(name[0])
	if !game.AddPlayer(player) {
		ctx.IndentedJSON(http.StatusConflict, CreateJSONError("Name already taken", 5))
		return
	}

	ctx.IndentedJSON(http.StatusOK, gin.H{
		"name":   player.Name,
		"public": public,
		"game":   game.Id,
	})

}

func main() {
	router := gin.Default()
	app := CreateApplication()

	router.LoadHTMLFiles("./dist/index.html")

	router.GET("/api/create", app.HandleCreateGame)
	router.GET("/api/join", app.HandleJoinGame)

	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.Static("/assets", "./dist/assets/")

	router.Run("localhost:8080")
}
