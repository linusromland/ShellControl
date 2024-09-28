package main

import (
	"fmt"
	"myapp/ipc"
)

func main() {
    cliIPC, err := ipc.NewIPC()
    if err != nil {
        fmt.Println("Error initializing IPC:", err)
        return
    }

    // Example message to the daemon
    err = cliIPC.Send("start process")
    if err != nil {
        fmt.Println("Error sending message:", err)
    } else {
        fmt.Println("Message sent to daemon")
    }
}
