import { useEffect, useState } from 'react';
import { Project } from '@local/shared/entities';
import { fetchUtil } from '../../../../utils/fetch.util';
import { useProjects } from '../../../../contexts/Projects.context';
import { Card, Spinner } from '@nextui-org/react';
import ProjectForm from '../../../../components/ProjectForm/ProjectForm';
import { UpdateProjectDto } from '@local/shared/dtos';
import { useNavigate } from 'react-router-dom';

type SettingsProps = {
	projectId: string;
	isStopped: boolean;
};

const Settings = ({ projectId, isStopped }: SettingsProps) => {
	const navigate = useNavigate();
	const { projects, fetchProjects } = useProjects();

	const [activeProject, setActiveProject] = useState<Project>();

	useEffect(() => {
		setActiveProject(projects.find((project) => project.id.toString() === projectId));
	}, [projects, projectId]);

	const handleSave = async (project: UpdateProjectDto) => {
		const response = await fetchUtil<Project>(`project/${projectId}`, {
			method: 'PATCH',
			body: JSON.stringify(project),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.success) {
			return;
		}

		if (project.startCommand && !isStopped) {
			await fetchUtil('commandRunner/stop/${projectId}', {
				method: 'DELETE'
			});
			await fetchUtil('commandRunner/start/${projectId}', {
				method: 'POST'
			});
		}

		fetchProjects();
	};

	const handleDelete = async (projectId: string) => {
		await fetchUtil(`project/${projectId}`, {
			method: 'DELETE'
		});
		await fetchProjects();
		navigate('/');
	}

	if (!activeProject) {
		return <Spinner />;
	}

	return (
		<Card style={{ margin: '0 0.5rem', padding: '1rem' }}>
			<ProjectForm
				newProject={false}
				initialValues={activeProject}
				onSave={handleSave}
				onDelete={handleDelete}
			/>
		</Card>
	);
};

export default Settings;
