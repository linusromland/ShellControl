import subprocess
import os
import sys
import time
from pystray import Icon as icon, Menu as menu, MenuItem as item
from PIL import Image
import portalocker
from pywinauto import Desktop, Application

ELECTRON_CLIENT_EXE = "../client/release/0.2.1/win-unpacked/ShellControl.exe"
API_SERVICE_EXE = "../api/release/main-win.exe"


def start_service():
    image = Image.open("icon.png")

    print("Starting ShellControl Service...")
    api_pid = subprocess.Popen([API_SERVICE_EXE])
    print("ShellControl Service started successfully.")
    handle_electron()

    def handle_open(icon):
        handle_electron()

    state = False

    def handle_autoboot(icon, item):
        nonlocal state
        state = not item.checked

    def handle_exit(icon):
        print("Exiting ShellControl Service...")
        handle_electron("close")
        api_pid.kill()
        icon.stop()

    icon('ShellControl Service', image, menu=menu(
        item('Open ShellControl', handle_open),
        item('Autostart on boot', handle_autoboot, checked=lambda item: state),
        item('Exit', handle_exit))).run()


def single_instance_check():
    lock_file_path = os.path.join(
        os.path.expanduser("~"), ".ShellControlService.lock")
    lock_file = open(lock_file_path, "w")

    try:
        portalocker.lock(lock_file, portalocker.LOCK_EX | portalocker.LOCK_NB)
    except portalocker.LockException:
        handle_electron()
        print("Another instance is already running. Exiting.")
        sys.exit(1)

    return lock_file


def handle_electron(action="open"):
    electron_pid = get_electron_pid()

    if action == "close" and electron_pid:
        app = Application(backend='uia').connect(process=electron_pid)
        main_window = app.window()
        main_window.close()

    if action == "open" and not electron_pid:
        print("Opening Electron client...")
        subprocess.Popen([ELECTRON_CLIENT_EXE])

    if action == "open" and electron_pid:
        print("Electron client already running, bringing to front...")
        app = Application(backend='uia').connect(process=electron_pid)
        main_window = app.window()
        main_window.set_focus()


def get_electron_pid():
    for proc in Desktop(backend='uia').windows():
        if proc.window_text() == "ShellControl":
            return proc.process_id()
    return None


def main():
    lock_file = single_instance_check()

    start_service()

    lock_file.close()
    os.remove(lock_file.name)


if __name__ == "__main__":
    main()
