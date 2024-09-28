package ipc

import (
	"errors"
	"runtime"
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
