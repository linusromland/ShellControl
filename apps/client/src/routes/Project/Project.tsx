import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Divider } from '@nextui-org/react';
import { Project as ProjectType } from '@local/shared/entities';
import { useProjects } from '../../contexts/Projects.context';
import style from './Project.module.css';
import TopBar from './components/TopBar/TopBar';

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

	const [project, setProject] = useState<ProjectType | undefined>(getProject(id));

	useEffect(() => {
		setProject(getProject(id));
	}, [projects, id, getProject]);

	if (!project) return;

	return (
		<div>
			<TopBar project={project} />
			<Divider />
			<Tabs className={style.tabs}>
				<Tab value='1'>
					<p>Current session</p>
				</Tab>
				<Tab value='2'>
					<p>Previous sessions</p>
				</Tab>
				<Tab value='2'>
					<p>Settings</p>
				</Tab>
			</Tabs>
		</div>
	);
};

export default Project;
