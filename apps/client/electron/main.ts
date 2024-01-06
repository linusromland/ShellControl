import { app, BrowserWindow, ipcMain, Notification } from 'electron';
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

	ipcMain.on('fsExistsSync', (event, filePath: fs.PathLike) => {
		event.returnValue = fs.existsSync(filePath);
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

	ipcMain.on('fsReadFileSync', (event, filePath: fs.PathOrFileDescriptor) => {
		event.returnValue = fs.readFileSync(filePath, 'utf8');
	});

	ipcMain.on('getAppPath', (event) => {
		event.returnValue = app.getAppPath();
	});

	ipcMain.on('getDirname', (event, filePath: string) => {
		event.returnValue = path.dirname(filePath);
	});

	ipcMain.on('sendNotification', (event, title: string, body: string, notificationId: string) => {
		try {
			const notification = new Notification({
				title,
				body
			});

			notification.on('click', () => {
				win?.webContents.send('notificationClicked', notificationId);
			});

			notification.show();
		} catch (error) {
			console.log(error);
		}
	});

	ipcMain.on('getVersion', (event) => {
		event.returnValue = app.getVersion();
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

app.setAppUserModelId(process.execPath);

app.whenReady().then(createWindow);
