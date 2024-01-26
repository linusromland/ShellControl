import subprocess
from pystray import Icon as icon, Menu as menu, MenuItem as item
from PIL import Image

image = Image.open("icon.png")
api_service_executable_path = "../release/main-win.exe"

print("Starting ShellControl Service...")

# Start the API service
# api_pid = subprocess.Popen([api_service_executable_path])
print("ShellControl Service started successfully.")


def handle_exit(icon):
    print("Exiting ShellControl Service...")
    # api_pid.kill()
    icon.stop()


state = False


def handle_autoboot(icon, item):
    global state
    state = not item.checked


# Update the state in `on_clicked` and return the new state in
# a `checked` callable
icon('ShellControl Service', image, menu=menu(
    item('Autostart on boot', handle_autoboot, checked=lambda item: state),
    item('Exit', handle_exit))).run()
