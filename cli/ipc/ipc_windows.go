//go:build windows
// +build windows

package ipc

import (
	"log"
	"os"
)

const pipeName = `\\.\pipe\ShellControl`

/*************  ✨ Codeium Command ⭐  *************/
// SendCommand sends a message to the daemon running on the same machine.
// It uses a named pipe to communicate with the daemon.
// The message is written to the pipe and the error is returned.
/******  8b263d9c-55f8-431b-9494-f59f6729a337  *******/
func SendCommand(msg string) error {
    file, err := os.OpenFile(pipeName, os.O_RDWR, 0)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = file.Write([]byte(msg))
    if err != nil {
        return err
    }

    log.Printf("Message sent to daemon: %s\n", msg)
    return nil
}
