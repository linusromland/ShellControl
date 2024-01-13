import { app, BrowserWindow, ipcMain, Notification, Tray, Menu } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import childProcess from 'node:child_process';
import killProcess from './killProcess';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');
const dirSeparator = process.platform === 'win32' ? '\\' : '/';

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
		event.returnValue = app.getPath('userData');
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

	ipcMain.on('getFavicon', (event) => {
		const imageBase64 = fs.readFileSync(path.join(process.env.VITE_PUBLIC, 'favicon.png'), 'base64');

		event.returnValue = `data:image/png;base64,${imageBase64}`;
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		const apiPath = getAPIPath();

		const date = new Date().toISOString().slice(0, 10).replace(/:/g, '-');
		const time = new Date().toISOString().slice(11, 16).replace(/:/g, '-');

		const logPath = app.getPath('userData') + `${dirSeparator}logs${dirSeparator}api-${date}-${time}.log`;

		// Create log directory if it doesn't exist
		if (!fs.existsSync(app.getPath('userData') + `${dirSeparator}logs`)) {
			fs.mkdirSync(app.getPath('userData') + `${dirSeparator}logs`);
		}

		// Create log file if it doesn't exist
		if (!fs.existsSync(logPath)) {
			fs.writeFileSync(logPath, '');
		}

		apiProcess = childProcess.spawn(apiPath.fileName, [], {
			cwd: apiPath.directory,
			shell: true
		});

		apiProcess.stdout?.on('data', (data) => {
			fs.appendFileSync(logPath, data);
		});

		apiProcess.stderr?.on('data', (data) => {
			fs.appendFileSync(logPath, data);
		});

		apiProcess.on('close', (code) => {
			fs.appendFileSync(logPath, `Session ended with code ${code}`);
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

function getAPIPath() {
	const exePath = app.getPath('exe');

	const splitPath = exePath.split(dirSeparator);
	splitPath.pop();
	const exeDir = splitPath.join(dirSeparator) + dirSeparator + 'api' + dirSeparator;

	let fileName = '';

	if (process.platform === 'win32') {
		fileName += 'main-win.exe';
	} else if (process.platform === 'darwin') {
		if (process.arch === 'arm64') {
			fileName += 'main-mac-arm64';
		} else {
			fileName += 'main-mac-x64';
		}
	} else {
		fileName += 'main-linux-x64';
	}

	fs.writeFileSync(
		app.getPath('userData') + '/apipath.txt',
		JSON.stringify({
			directory: exeDir,
			fileName: fileName
		})
	);

	return {
		directory: exeDir,
		fileName: fileName
	};
}
