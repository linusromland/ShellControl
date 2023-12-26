export default function getFs() {
	return {
		existsSync: (path: string) => window.ipcRenderer.sendSync('fsExistsSync', path),
		writeFileSync: (file: string, data: string, options?: Record<string, unknown>) =>
			window.ipcRenderer.sendSync('fsWriteFileSync', file, data, options),
		readFileSync: (path: string) => window.ipcRenderer.sendSync('fsReadFileSync', path)
	};
}
