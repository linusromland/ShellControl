import getFs from './fs.util';

export enum StorageConfigKey {
	API_URL = 'apiURL'
}

export interface StorageConfig {
	[StorageConfigKey.API_URL]?: string;
}

export default class Storage {
	private fs = getFs();
	private configPath = `${window.ipcRenderer.sendSync('getAppPath')}/storage.json`;
	private config: StorageConfig = {};

	constructor() {
		this.init();
	}

	private generateBaseConfig() {
		return {
			[StorageConfigKey.API_URL]: 'http://localhost:63000'
		};
	}

	private init() {
		if (!this.fs.existsSync(this.configPath)) {
			console.log('Creating storage file at', this.configPath);
			this.fs.writeFileSync(this.configPath, JSON.stringify(this.generateBaseConfig()));
		}

		this.getConfigFromFile();
	}

	private getConfigFromFile() {
		this.config = JSON.parse(this.fs.readFileSync(this.configPath));
	}

	get(key: keyof StorageConfig) {
		return this.config?.[key] ?? undefined;
	}

	set(key: keyof StorageConfig, value: StorageConfig[keyof StorageConfig]) {
		this.config[key] = value;
		this.fs.writeFileSync(this.configPath, JSON.stringify(this.config));
		this.getConfigFromFile();
	}
}
