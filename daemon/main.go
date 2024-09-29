package main

import (
	"log"

	"github.com/linusromland/ShellControl/daemon/ipc"
)

func main() {

    log.Println("Daemon started")

    // Start IPC based on platform (Unix or Windows)
    err := ipc.StartIPC()
    if err != nil {
        log.Println("Error running daemon:", err)
    }
}
