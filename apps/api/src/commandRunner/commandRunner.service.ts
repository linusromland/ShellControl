import { Injectable, NotFoundException } from '@nestjs/common';
import { Observable, Observer } from 'rxjs';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { CommandStatus } from '@local/shared/enums';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class CommandRunnerService {
	constructor(private readonly projectService: ProjectService) {}

	private runningCommands: Map<number, ChildProcessWithoutNullStreams> = new Map();
	private logs: Map<number, string[]> = new Map();

	async runCommand(projectId: number): Promise<Observable<string>> {
		const project = await this.projectService.findOne(projectId);

		if (!project) {
			throw new NotFoundException('Project not found.');
		}

		const command = project.startCommand;
		const cwd = project.directory;

		if (this.runningCommands.has(projectId)) {
			throw new Error('Command is already running for this project.');
		}

		const childProcess = spawn(command, [], { cwd, shell: true, stdio: 'pipe' });
		this.runningCommands.set(projectId, childProcess);

		const observable = new Observable((observer: Observer<string>) => {
			const onData = (data: Buffer) => {
				const log = data.toString();
				const logs = this.logs.get(projectId) || [];
				logs.push(log);
				this.logs.set(projectId, logs);
				observer.next(log);
			};

			childProcess.stdout.on('data', onData);
			childProcess.stderr.on('data', onData);

			childProcess.on('close', (code: number) => {
				this.runningCommands.delete(projectId);

				if (code === 0) {
					observer.complete();
				} else {
					observer.error(`Command failed with code ${code}`);
				}
			});
		});

		return observable;
	}

	stopCommand(projectId: number): void {
		const childProcess = this.runningCommands.get(projectId);

		if (!childProcess) {
			throw new NotFoundException('Command not found for this project.');
		}

		childProcess.kill();
		this.runningCommands.delete(projectId);
	}

	getCommandStatus(projectId: number): string {
		if (this.runningCommands.has(projectId)) {
			return CommandStatus.RUNNING;
		} else {
			return CommandStatus.STOPPED;
		}
	}

	getCommandLogs(projectId: number): string[] {
		if (!this.logs.has(projectId)) {
			return [];
		}

		return this.logs.get(projectId);
	}
}
