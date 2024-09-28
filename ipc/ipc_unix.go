//go:build linux || darwin
// +build linux darwin

package ipc

import (
	"net"
	"os"
)

type unixIPC struct {
    path string
}

func newUnixIPC() IPC {
    return &unixIPC{
        path: "/tmp/myapp.sock",
    }
}

func (ipc *unixIPC) Listen() error {
    os.Remove(ipc.path)  // Remove existing socket file if it exists
    l, err := net.Listen("unix", ipc.path)
    if err != nil {
        return err
    }
    defer l.Close()

    for {
        conn, err := l.Accept()
        if err != nil {
            return err
        }
        go handleConnection(conn)
    }
}

func (ipc *unixIPC) Send(msg string) error {
    conn, err := net.Dial("unix", ipc.path)
    if err != nil {
        return err
    }
    defer conn.Close()

    _, err = conn.Write([]byte(msg))
    return err
}

func handleConnection(conn net.Conn) {
    // Handle incoming message from the CLI
    defer conn.Close()
    // Read and process the message
}
