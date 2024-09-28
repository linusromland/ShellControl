//go:build windows
// +build windows

package ipc

import (
	"os"

	"golang.org/x/sys/windows"
)

type windowsIPC struct {
    pipeName string
}

func newWindowsIPC() IPC {
    return &windowsIPC{
        pipeName: `\\.\pipe\myapp`,
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
