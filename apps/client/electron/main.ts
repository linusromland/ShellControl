import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { setupIPCMainHandlers } from './ipcMainHandlers';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'favicon.png'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		autoHideMenuBar: true,
		width: 1024,
		height: 768
	});

	win.webContents.on('before-input-event', (_, input) => {
		if (input.key === 'F12') {
			win?.webContents.toggleDevTools();
		}
	});

	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	setupIPCMainHandlers(win);

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		win.loadFile(path.join(process.env.DIST, 'index.html'));
	}

	win.on('closed', () => {
		win = null;
	});

	win.on('close', (event) => {
		if (win) {
			win.hide();
			event.preventDefault();
		}
	});
}

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.setAppUserModelId(process.execPath);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
