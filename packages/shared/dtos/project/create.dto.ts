export interface CreateProjectDto {
	name: string;
	description?: string;
	directory: string;
	startCommand: string;
	autoStart: boolean;
}
