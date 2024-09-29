//go:build linux || darwin
// +build linux darwin

package ipc

import (
	"log"
	"net"
)

const socketPath = "/tmp/ShellControl.sock"

func SendCommand(msg string) error {
    conn, err := net.Dial("unix", socketPath)
    if err != nil {
        return err
    }
    defer conn.Close()

    _, err = conn.Write([]byte(msg))
    if err != nil {
        return err
    }

    log.Printf("Message sent to daemon: %s\n", msg)
    return nil
}
