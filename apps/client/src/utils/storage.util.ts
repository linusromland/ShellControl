import getFs from './fs.util';

export enum StorageConfigKey {
	API_URL = 'apiURL'
}

export interface StorageConfig {
	[StorageConfigKey.API_URL]?: string;
}

export default class Storage {
	private fs = getFs();
	private configPath = `${window.ipcRenderer.sendSync('get-app-path')}/storage.json`;
	private config: StorageConfig = {};

	constructor() {
		this.init();
	}

	init() {
		if (!this.fs.existsSync(this.configPath)) {
			this.fs.writeFileSync(this.configPath, JSON.stringify({}));
		}

		this.getConfigFromFile();
	}

	getConfigFromFile() {
		this.config = JSON.parse(this.fs.readFileSync(this.configPath));
	}

	get(key: keyof StorageConfig) {
		return this.config[key] ?? undefined;
	}

	set(key: keyof StorageConfig, value: StorageConfig[keyof StorageConfig]) {
		this.config[key] = value;
		this.fs.writeFileSync(this.configPath, JSON.stringify(this.config));
		this.getConfigFromFile();
	}
}
