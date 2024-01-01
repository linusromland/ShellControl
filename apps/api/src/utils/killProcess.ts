import { exec } from 'child_process';
import { Logger } from '@nestjs/common';

const logger = new Logger('killProcess');

function killProcess(pid: number): Promise<boolean> {
	logger.log(`Killing process with PID ${pid}`);
	return new Promise<boolean>((resolve) => {
		let command = '';
		if (process.platform === 'win32') {
			command = `taskkill /F /PID ${pid}`;
		} else if (process.platform === 'darwin' || process.platform === 'linux') {
			command = `kill -9 ${pid}`;
		} else {
			const errorMessage = `Unsupported operating system: ${process.platform}`;
			logger.error(errorMessage);
			resolve(false);
			return;
		}

		exec(command, async (error, stdout, stderr) => {
			if (error) {
				const errorMessage = `Error killing process: ${error.message}`;
				logger.error(errorMessage);
				resolve(false);
				return;
			}

			if (stderr) {
				const errorMessage = `Error output from command: ${stderr}`;
				logger.error(errorMessage);
				resolve(false);
				return;
			}

			const successMessage = `Process with PID ${pid} killed successfully`;
			logger.log(successMessage);

			await killChildProcesses(pid);

			resolve(true);
		});
	});
}

async function killChildProcesses(parentPid: number): Promise<void> {
	// Get the list of child processes
	const getChildProcessesCommand =
		process.platform === 'win32'
			? `wmic process where (ParentProcessId=${parentPid}) get ProcessId`
			: `pgrep -P ${parentPid}`;

	exec(getChildProcessesCommand, (error, stdout, stderr) => {
		if (error || stderr) {
			return;
		}

		const childPids = stdout
			.trim()
			.split('\n')
			.map((pidString) => parseInt(pidString, 10))
			.filter((pid) => !isNaN(pid));

		childPids.forEach(async (childPid) => {
			await killProcess(childPid);
		});
	});
}

export default killProcess;
