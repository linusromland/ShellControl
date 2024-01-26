import pystray
from PIL import Image

image = Image.open("icon.png")

openClient = "Open ShellControl UI"
exitApp = "Exit"


def after_click(icon, query):
    if str(query) == openClient:
        print("Opening ShellControl Client...")
    elif str(query) == exitApp:
        icon.stop()


icon = pystray.Icon("SC", image, "ShellControl",
                    menu=pystray.Menu(
                        pystray.MenuItem(openClient, after_click),
                        pystray.MenuItem(exitApp, after_click)))

icon.run()
