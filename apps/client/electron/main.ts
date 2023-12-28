import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

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
		autoHideMenuBar: true
	});

	win.webContents.openDevTools();

	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	ipcMain.on('fsExistsSync', (event, path: fs.PathLike) => {
		event.returnValue = fs.existsSync(path);
	});

	ipcMain.on(
		'fsWriteFileSync',
		(
			event,
			file: fs.PathOrFileDescriptor,
			data: string | NodeJS.ArrayBufferView,
			options?: fs.WriteFileOptions | undefined
		) => {
			event.returnValue = fs.writeFileSync(file, data, options);
		}
	);

	ipcMain.on('fsReadFileSync', (event, path: fs.PathOrFileDescriptor) => {
		event.returnValue = fs.readFileSync(path, 'utf8');
	});

	ipcMain.on('getAppPath', (event) => {
		event.returnValue = app.getAppPath();
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		win.loadFile(path.join(process.env.DIST, 'index.html'));
	}
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
