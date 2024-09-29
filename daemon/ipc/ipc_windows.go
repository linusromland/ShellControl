//go:build windows
// +build windows

package ipc

import (
	"log"

	"golang.org/x/sys/windows"
)

const pipeName = `\\.\pipe\ShellControl`

func StartIPC() error {
    pipe, err := windows.CreateNamedPipe(
        windows.StringToUTF16Ptr(pipeName),
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

    log.Println("Daemon listening on named pipe:", pipeName)

    for {
        err := windows.ConnectNamedPipe(pipe, nil)
        if err != nil && err != windows.ERROR_PIPE_CONNECTED {
            log.Println("Error connecting pipe:", err)
            continue
        }
        go handlePipeConnection(pipe)
    }
}

func handlePipeConnection(pipe windows.Handle) {
    defer windows.CloseHandle(pipe)

    buf := make([]byte, 4096)
    var read uint32

    err := windows.ReadFile(pipe, buf, &read, nil)
    if err != nil {
        log.Println("Error reading from pipe:", err)
        return
    }

    msg := string(buf[:read])
    log.Println("Message received from daemon:", msg)
}
