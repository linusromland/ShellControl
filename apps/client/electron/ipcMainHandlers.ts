import { app, ipcMain, Notification, dialog, BrowserWindow } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

export function setupIPCMainHandlers(win?: BrowserWindow | null) {
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

	ipcMain.on(
		'sendNotification',
		(_, title: string, body: string, notificationChannel: string, notificationId: string) => {
			try {
				const notification = new Notification({
					title,
					body
				});

				notification.on('click', () => {
					win?.webContents.send(notificationChannel, notificationId);
				});

				notification.show();
			} catch (error) {
				console.log(error);
			}
		}
	);

	ipcMain.on('getVersion', (event) => {
		event.returnValue = app.getVersion();
	});

	ipcMain.on('getFavicon', (event) => {
		const imageBase64 = fs.readFileSync(path.join(process.env.VITE_PUBLIC, 'favicon.png'), 'base64');

		event.returnValue = `data:image/png;base64,${imageBase64}`;
	});

	ipcMain.on('openDirectoryDialog', async (event) => {
		const result = await dialog.showOpenDialog(win!, {
			properties: ['openDirectory']
		});

		event.returnValue = result.filePaths[0];
	});
}
