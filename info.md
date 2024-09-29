To set up the base for your CLI and daemon app in Golang, here's a suggested structure and a communication system using Unix domain sockets (for Linux/macOS) and named pipes (for Windows). This method avoids HTTP and WebSockets while still providing efficient inter-process communication (IPC).
Project Structure

plaintext

project-root/
│
├── daemon/
│   ├── main.go            # Entry point for the daemon
│   ├── server.go          # Daemon logic and communication handling
│   └── utils.go           # Common utilities for daemon
│
├── cli/
│   ├── main.go            # Entry point for the CLI
│   └── client.go          # CLI logic and communication with the daemon
│
├── ipc/
│   ├── ipc.go             # Platform-specific communication handling
│   ├── ipc_unix.go        # Unix domain socket for Linux/macOS
│   └── ipc_windows.go     # Named pipes for Windows
│
├── go.mod                 # Go module file
└── README.md              # Project documentation

Key components

    Daemon (daemon/main.go, daemon/server.go): The daemon will run in the background and handle processes. It listens for commands from the CLI via the IPC mechanism.

    CLI (cli/main.go, cli/client.go): The CLI will send commands to the daemon, such as starting or stopping a process.

    IPC (ipc/ipc.go, ipc/ipc_unix.go, ipc/ipc_windows.go): This will handle communication between the daemon and the CLI. Based on the platform, it will use either Unix domain sockets or Windows named pipes.

Example Code
IPC (ipc/ipc.go)

This file will contain platform-independent logic.

go

package ipc

import (
    "runtime"
    "errors"
)

var ErrUnsupportedPlatform = errors.New("unsupported platform")

type IPC interface {
    Listen() error
    Send(msg string) error
}

func NewIPC() (IPC, error) {
    switch runtime.GOOS {
    case "windows":
        return newWindowsIPC(), nil
    case "linux", "darwin":
        return newUnixIPC(), nil
    default:
        return nil, ErrUnsupportedPlatform
    }
}

Unix Sockets (ipc/ipc_unix.go)

For Linux and macOS, use Unix domain sockets.

go

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
        path: "/tmp/ShellControl.sock",
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

Named Pipes (Windows) (ipc/ipc_windows.go)

For Windows, use named pipes.

go

// +build windows

package ipc

import (
    "fmt"
    "os"
    "golang.org/x/sys/windows"
)

type windowsIPC struct {
    pipeName string
}

func newWindowsIPC() IPC {
    return &windowsIPC{
        pipeName: `\\.\pipe\ShellControl`,
    }
}

func (ipc *windowsIPC) Listen() error {
    pipe, err := windows.CreateNamedPipe(
        windows.StringToUTF16Ptr(ipc.pipeName),
        windows.PIPE_ACCESS_DUPLEX,
        windows.PIPE_TYPE_MESSAGE|windows.PIPE_READMODE_MESSAGE|windows.PIPE_WAIT,
        1,
        4096,
        4096,
        0,
        nil,
    )
    if err != nil {
        return err
    }
    defer windows.CloseHandle(pipe)

    for {
        err := windows.ConnectNamedPipe(pipe, nil)
        if err != nil && err != windows.ERROR_PIPE_CONNECTED {
            return err
        }
        go handlePipeConnection(pipe)
    }
}

func (ipc *windowsIPC) Send(msg string) error {
    file, err := os.OpenFile(ipc.pipeName, os.O_RDWR, 0)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = file.Write([]byte(msg))
    return err
}

func handlePipeConnection(pipe windows.Handle) {
    // Handle incoming message from the CLI
}

Daemon (daemon/main.go)

go

package main

import (
    "fmt"
    "ShellControl/ipc"
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

CLI (cli/main.go)

go

package main

import (
    "fmt"
    "ShellControl/ipc"
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

Summary of Steps:

    Daemon: The daemon listens for messages over IPC (Unix socket or named pipes).
    CLI: The CLI sends commands to the daemon via the same IPC mechanism.
    Cross-Platform IPC: Unix domain sockets for Linux/macOS and named pipes for Windows.

You can now build on this base structure by implementing the actual process management functionality and extending the communication protocol between the CLI and daemon.