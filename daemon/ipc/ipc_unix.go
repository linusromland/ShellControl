//go:build linux || darwin
// +build linux darwin

package ipc

import (
	"log"
	"net"
	"os"
)

const socketPath = "/tmp/ShellControl.sock"

func StartIPC() error {
    os.Remove(socketPath)
    l, err := net.Listen("unix", socketPath)
    if err != nil {
        return err
    }
    defer l.Close()

    log.Println("Daemon listening on Unix socket:", socketPath)

    for {
        conn, err := l.Accept()
        if err != nil {
            log.Println("Error accepting connection:", err)
            continue
        }
        go handleConnection(conn)
    }
}

func handleConnection(conn net.Conn) {
    defer conn.Close()

    buf := make([]byte, 1024)
    n, err := conn.Read(buf)
    if err != nil {
        log.Println("Error reading from connection:", err)
        return
    }

    msg := string(buf[:n])
    log.Println("Message received from CLI:", msg)
}
