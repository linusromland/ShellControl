import { useCallback, useState } from 'react';
import { Button, ButtonGroup } from '@nextui-org/react';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Project } from '@local/shared/entities';
import { useProjects } from '../../../../contexts/Projects.context';
import { fetchUtil } from '../../../../utils/fetch.util';
import style from './TopBar.module.css';
import { startCase } from 'lodash';

type TopBarProps = {
	project: Project;
};

export default function TopBar({ project }: TopBarProps) {
	const { name, description, createdAt, id } = project;
	const [buttonLoading, setButtonLoading] = useState('');

	const { projects } = useProjects();
	const projectStatus = projects.find((p) => p.id === id)?.status || 'STOPPED';

	const handleStartStop = useCallback(
		async (action: 'start' | 'stop') => {
			const method = action === 'start' ? 'POST' : 'DELETE';
			const response = await fetchUtil(`commandRunner/${action}/${id}`, {
				method
			});

			console.log(response);
		},
		[id]
	);

	const handleRestart = useCallback(async () => {
		await handleStartStop('stop');
		await handleStartStop('start');
	}, [handleStartStop]);

	const handleStartStopButton = useCallback(async () => {
		// window.ipcRenderer.sendSync('sendNotification', 'Hello!', 'This is a notification!', 'tjotjoSvante');

		// window.ipcRenderer.on('notificationClicked', (event, title, body) => {
		// 	console.log(title, body);
		// });

		setButtonLoading('start-stop');
		await handleStartStop(projectStatus === 'STOPPED' ? 'start' : 'stop');
		setButtonLoading('');
	}, [handleStartStop, projectStatus]);

	const handleRestartButton = useCallback(async () => {
		setButtonLoading('restart');
		await handleRestart();
		setButtonLoading('');
	}, [handleRestart]);

	return (
		<div className={style.header}>
			<div className={style.title}>
				<h1>{name}</h1>
				<p>{description}</p>
				<p>Status: {startCase(projectStatus.toLowerCase())}</p>
				<p>Created: {createdAt}</p>
			</div>
			<ButtonGroup>
				<Button
					color='primary'
					startContent={projectStatus === 'STOPPED' ? <PlayCircleFilledWhiteIcon /> : <StopCircleIcon />}
					onClick={handleStartStopButton}
					isLoading={buttonLoading === 'start-stop'}
				>
					{projectStatus === 'STOPPED' ? 'Start' : 'Stop'}
				</Button>
				<Button
					color={'primary'}
					startContent={<RestartAltIcon />}
					onClick={handleRestartButton}
					isLoading={buttonLoading === 'restart'}
					isDisabled={projectStatus === 'STOPPED'}
				>
					Restart
				</Button>
			</ButtonGroup>
		</div>
	);
}
