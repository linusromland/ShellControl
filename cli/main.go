package main

import (
	"fmt"
	"log"
	"os"

	"github.com/linusromland/ShellControl/cli/ipc" // Adjust import path
)

func main() {
    if len(os.Args) < 2 {
        fmt.Println("Usage: cli <command>")
        return
    }
    command := os.Args[1]

    err := ipc.SendCommand(command)
    if err != nil {
        log.Println("Error sending command:", err)
    } else {
        log.Println("Command sent:", command)
    }
}
