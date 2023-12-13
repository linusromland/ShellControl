import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class ShellService {
	async runCommand(command: string): Promise<string> {
		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					reject(error.message);
				} else if (stderr) {
					reject(stderr);
				} else {
					resolve(stdout);
				}
			});
		});
	}
}
