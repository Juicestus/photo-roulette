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
	return fmt.Sprintf("%x", sha256.Sum256([]byte(fmt.Sprintf("%d", RandInt(1, 999999999999)))))[:32]
}

type Player struct {
	privateKey string
	targetKey  string

	Name string `json:"name"`
}

func CreatePlayer(name string) (Player, string) {
	private := NewRandomString()
	public := NewRandomString()

	p := Player{
		Name:       name,
		privateKey: private,
		targetKey:  HashString(private + public),
	}

	return p, public
}

type Game struct {
	Id   string
	guid string

	Host    Player
	Players map[string]Player
	Started bool
	Round   int
}

func CreateGame(code string, host Player, uid int) Game {
	return Game{
		Id:      code,
		Host:    host,
		Players: map[string]Player{host.Name: host},
		guid:    fmt.Sprintf("%016d", uid),
		Started: false,
		Round:   0,
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
	guid  int
}

func CreateApplication() *Application {
	return &Application{
		Games: make(map[string]Game),
		guid:  0,
	}
}

func (a *Application) GetGUID() int {
	a.guid++
	return a.guid
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
	game := CreateGame(code, host, a.GetGUID())
	a.Games[game.Id] = game

	log.Println("Created game #" + game.Id)

	ctx.IndentedJSON(http.StatusOK, gin.H{
		"guid":   game.guid,
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
		"guid":   game.guid,
		"name":   player.Name,
		"public": public,
		"game":   game.Id,
	})

}

func (a *Application) HandleLobbyActions(ctx *gin.Context) {
	code := ctx.Request.URL.Query()["code"]
	if code == nil {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Code not specified", 6))
		return
	}

	game, ok := a.Games[code[0]]
	if !ok {
		ctx.IndentedJSON(http.StatusNotFound, CreateJSONError("Game not found", 7))
		return
	}

	name := ctx.Request.URL.Query()["name"]
	if code == nil {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Name not specified", 8))
		return
	}

	player := game.Players[name[0]]

	public := ctx.Request.URL.Query()["public"]
	if public == nil {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Public key not specified", 8))
		return
	}

	auth := HashString(player.privateKey+public[0]) == player.targetKey
	if !auth {
		ctx.IndentedJSON(http.StatusUnauthorized, CreateJSONError("Invalid key", 9))
		return
	}

	host := player.targetKey == game.Host.targetKey

	players := []string{}
	for _, player := range game.Players {
		players = append(players, player.Name)
	}

	action := ctx.Request.URL.Query()["action"]
	if action == nil {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Action not specified", 10))
		return
	}

	if action[0] == "update" {
		// log.Printf("%s -> %t\n", game.Id, game.Started)
		ctx.IndentedJSON(http.StatusOK, gin.H{
			"guid":     game.guid,
			"name":     player.Name,
			"ishost":   host,
			"players":  players,
			"hostname": game.Host.Name,
			"started":  game.Started,
		})
	} else if action[0] == "start" {
		log.Printf("%s -> %t\n", game.Id, host)
		if !host {
			ctx.IndentedJSON(http.StatusForbidden, CreateJSONError("Not host", 11))
			return
		}
		game.Started = true
		ctx.IndentedJSON(http.StatusOK, gin.H{
			"guid":     game.guid,
			"name":     player.Name,
			"ishost":   host,
			"players":  players,
			"hostname": game.Host.Name,
			"started":  game.Started,
		})
		a.Games[game.Id] = game
	} else if action[0] == "leave" {
		delete(game.Players, player.Name)
		ctx.IndentedJSON(http.StatusOK, gin.H{})
		if host {
			delete(a.Games, game.Id)
		}
	} else {
		ctx.IndentedJSON(http.StatusBadRequest, CreateJSONError("Invalid action", 11))
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())

	router := gin.Default()
	app := CreateApplication()

	router.LoadHTMLFiles("./dist/index.html")

	router.GET("/api/create", app.HandleCreateGame)
	router.GET("/api/join", app.HandleJoinGame)
	router.GET("/api/lobby", app.HandleLobbyActions)

	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.Static("/assets", "./dist/assets/")

	router.Run("localhost:8080")
}
