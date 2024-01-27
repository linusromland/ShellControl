import subprocess
import os
import sys
from pystray import Icon as icon, Menu as menu, MenuItem as item
from PIL import Image
import portalocker


def start_service():
    image = Image.open("icon.png")
    api_service_executable_path = "../release/main-win.exe"

    print("Starting ShellControl Service...")
    api_pid = subprocess.Popen([api_service_executable_path])
    print("ShellControl Service started successfully.")

    def handle_open(icon):
        print("Opening ShellControl...")

    state = False

    def handle_autoboot(icon, item):
        nonlocal state
        state = not item.checked

    def handle_exit(icon):
        print("Exiting ShellControl Service...")
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
        print("Another instance is already running. Exiting.")
        sys.exit(1)

    return lock_file


def main():
    lock_file = single_instance_check()

    start_service()

    lock_file.close()
    os.remove(lock_file.name)


if __name__ == "__main__":
    main()
