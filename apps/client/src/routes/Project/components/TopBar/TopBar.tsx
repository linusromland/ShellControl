import { useCallback, useState } from 'react';
import { startCase } from 'lodash';
import dayjs from 'dayjs';
import { Button, ButtonGroup } from '@nextui-org/react';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Project } from '@local/shared/entities';
import { useProjects } from '../../../../contexts/Projects.context';
import { fetchUtil } from '../../../../utils/fetch.util';
import style from './TopBar.module.css';

type TopBarProps = {
	project: Project;
	isStopped: boolean;
};

export default function TopBar({ project, isStopped }: TopBarProps) {
	const { name, description, createdAt, id } = project;
	const [buttonLoading, setButtonLoading] = useState('');

	const { projects } = useProjects();
	const projectStatus = projects.find((p) => p.id === id)?.status || 'STOPPED';

	const handleStartStop = useCallback(
		async (action: 'start' | 'stop') => {
			const method = action === 'start' ? 'POST' : 'DELETE';
			await fetchUtil(`commandRunner/${action}/${id}`, {
				method
			});
		},
		[id]
	);

	const handleRestart = useCallback(async () => {
		await handleStartStop('stop');
		await handleStartStop('start');
	}, [handleStartStop]);

	const handleStartStopButton = useCallback(async () => {
		setButtonLoading('start-stop');
		await handleStartStop(isStopped ? 'start' : 'stop');
		setButtonLoading('');
	}, [handleStartStop, isStopped]);

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
				<p>Created: {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}</p>
			</div>
			<ButtonGroup>
				<Button
					color='primary'
					startContent={isStopped ? <PlayCircleFilledWhiteIcon /> : <StopCircleIcon />}
					onClick={handleStartStopButton}
					isLoading={buttonLoading === 'start-stop'}
				>
					{isStopped ? 'Start' : 'Stop'}
				</Button>
				<Button
					color={'primary'}
					startContent={<RestartAltIcon />}
					onClick={handleRestartButton}
					isLoading={buttonLoading === 'restart'}
					isDisabled={isStopped}
				>
					Restart
				</Button>
			</ButtonGroup>
		</div>
	);
}
