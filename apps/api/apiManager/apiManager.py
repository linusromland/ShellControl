import subprocess
import pystray
from PIL import Image

image = Image.open("icon.png")

api_service_executable_path = "../release/main-win.exe"

print("Starting ShellControl Service...")

# Start the API service
api_pid = subprocess.Popen([api_service_executable_path])

print("ShellControl Service started successfully.")


def handle_click(icon):
    print("Exiting ShellControl Service...")
    api_pid.kill()
    icon.stop()


icon = pystray.Icon("SCS", image, "ShellControl Service",
                    menu=pystray.Menu(
                        pystray.MenuItem("Exit ShellControl Service", handle_click)))

icon.run()
