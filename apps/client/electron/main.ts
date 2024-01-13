import { app, BrowserWindow, ipcMain, Notification, Tray, Menu } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import childProcess from 'node:child_process';
import killProcess from './killProcess';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
let tray: Tray | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
let apiProcess: childProcess.ChildProcess | null = null;

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

	ipcMain.on('sendNotification', (_, title: string, body: string, notificationId: string) => {
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
		apiProcess = childProcess.spawn('cd', [path.join(process.env.DIST, '../api'), '&&', 'npm', 'run', 'start'], {
			shell: true
		});
		win.loadFile(path.join(process.env.DIST, 'index.html'));
	}

	win.on('closed', () => {
		win = null;
	});

	win.on('close', (event) => {
		event.preventDefault();
		win?.hide();
	});
}

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.setAppUserModelId(process.execPath);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {});

app.on('ready', () => {
	tray = new Tray(path.join(process.env.VITE_PUBLIC, 'favicon.png'));

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Show',
			click: () => {
				win?.show();
			}
		},
		{
			label: 'Quit',
			click: () => {
				apiProcess && killProcess(apiProcess?.pid as number);
				process.exit(0);
			}
		}
	]);

	tray.setToolTip('ShellControl');
	tray.setContextMenu(contextMenu);
});
