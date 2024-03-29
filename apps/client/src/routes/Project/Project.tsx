import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Divider } from '@nextui-org/react';
import { Session } from '@local/shared/entities';
import { useProjects } from '../../contexts/Projects.context';
import TopBar from './components/TopBar/TopBar';
import CurrentSession from './tabs/CurrentSession/CurrentSession';
import PreviousSessions from './tabs/PreviousSessions/PreviousSessions';
import { fetchUtil } from '../../utils/fetch.util';
import style from './Project.module.css';
import Settings from './tabs/Settings/Settings';

const Project: React.FC = () => {
	const { projects } = useProjects();
	const { id } = useParams();

	const getProject = useCallback(
		(id?: string) => {
			if (!id) return;
			return projects.find((project) => project.id.toString() === id);
		},
		[projects]
	);

	const [project, setProject] = useState(getProject(id));
	const [sessions, setSessions] = useState<Omit<Session, 'logs'>[]>([]);

	const isStopped = useMemo(() => !project?.status || project?.status === 'STOPPED', [project]);

	const currentSession = useMemo(() => sessions.find((session) => session.status === 'RUNNING'), [sessions]);
	const latestSession = useMemo(
		() => sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0],
		[sessions]
	);

	const getProjectSessions = useCallback(async () => {
		if (!id) return;
		return await fetchUtil<Omit<Session, 'logs'>[]>(`commandRunner/sessions/${id}`, {
			method: 'GET'
		});
	}, [id]);

	useEffect(() => {
		(async () => {
			setProject(getProject(id));

			const retrievedSessions = await getProjectSessions();
			if (retrievedSessions?.success && retrievedSessions?.data) setSessions(retrievedSessions.data);
		})();
	}, [projects, id, getProject, getProjectSessions]);

	if (!project) return;

	return (
		<div className={style.container}>
			<TopBar
				project={project}
				isStopped={isStopped && !currentSession}
			/>
			<Divider />
			<Tabs className={style.tabs}>
				<Tab
					className={style.tab}
					title='Current session'
					key='currentSession'
				>
					<CurrentSession
						projectId={id ?? ''}
						isStopped={isStopped && !currentSession}
						session={latestSession}
					/>
				</Tab>
				<Tab
					className={style.tab}
					title='Previous sessions'
					key='previousSessions'
				>
					<PreviousSessions sessions={sessions.filter((session) => session.status !== 'RUNNING')} />
				</Tab>
				<Tab
					className={style.tab}
					title='Settings'
					key='settings'
				>
					<Settings
						projectId={id ?? ''}
						isStopped={isStopped && !currentSession}
					/>
				</Tab>
			</Tabs>
		</div>
	);
};

export default Project;
