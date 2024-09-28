package main

import (
	"fmt"

	"github.com/linusromland/ShellControl/ipc"
)

func main() {
    daemonIPC, err := ipc.NewIPC()
    if err != nil {
        fmt.Println("Error starting IPC:", err)
        return
    }
    err = daemonIPC.Listen()
    if err != nil {
        fmt.Println("Error running daemon:", err)
    }
}
