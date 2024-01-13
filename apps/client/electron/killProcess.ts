import { exec } from 'child_process';

function killProcess(pid: number): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		let command = '';
		if (process.platform === 'win32') {
			command = `taskkill /F /PID ${pid}`;
		} else if (process.platform === 'darwin' || process.platform === 'linux') {
			command = `kill -9 ${pid}`;
		} else {
			resolve(false);
			return;
		}

		exec(command, async (error, stdout, stderr) => {
			if (error) {
				resolve(false);
				return;
			}

			if (stderr) {
				resolve(false);
				return;
			}

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
