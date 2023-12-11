package http

import (
	httpRoutes "ShellControl_Server/src/http/routes"
	"ShellControl_Server/src/websocket"

	"github.com/gin-gonic/gin"
)

func SetupServer() {
	r := gin.Default()

	// Configure HTTP routes
	httpRoutes.Setup(r)

	// Configure WebSocket routes
	websocket.SetupHTTPRoutes(r)

	// Set trusted proxies
	r.SetTrustedProxies([]string{"127.0.0.1"})

	r.Run(":8080")
}
