import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@local/shared/entities';
import { useSocket } from '../hooks/useSocket';
import { fetchUtil } from '../utils/fetch.util';

interface ProjectsContextProps {
	projects: (Project & { status?: string })[];
	fetchProjects: () => void;
}

const ProjectsContext = createContext<ProjectsContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = (): ProjectsContextProps => {
	const context = useContext(ProjectsContext);

	if (!context) {
		throw new Error('useProjects must be used within a ProjectsProvider');
	}

	return context;
};

export const ProjectsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [projects, setProjects] = useState<(Project & { status?: string })[]>([]);

	useSocket({
		roomId: 'status',
		event: '*',
		onEvent: (
			projectId,
			data: {
				status: string;
				updatedAt: string;
			}
		) => {
			// Find the project by the id
			const project = projects.find((p) => p.id.toString() === projectId);

			// If the project doesn't exist, return
			if (!project) return;

			// Check if the status is the same as the current status
			if (project.status === data.status) return;

			// Check if the updateAt in data.updatedAt is newer than the one in project.updatedAt
			if (new Date(data.updatedAt) < new Date(project.updatedAt)) return;

			console.log(`Project ${projectId} status changed to ${data.status}`);

			const updatedProjects = projects.map((project) =>
				project.id.toString() === projectId ? { ...project, status: data.status } : project
			);

			setProjects(updatedProjects as (Project & { status?: string })[]);
		}
	});

	const fetchProjects = async (): Promise<void> => {
		const response = await fetchUtil<Project[]>('project', {
			method: 'GET'
		});

		if (!response.success) throw new Error(response.message);

		const promises = (response.data || []).map(async (project) => {
			const statusResponse = await fetchUtil<string>(`commandRunner/status/${project.id}`, {
				method: 'GET'
			});

			if (!statusResponse.success) throw new Error(statusResponse.message);

			return { ...project, status: statusResponse.data };
		});

		const retrievedProjects = await Promise.all(promises);

		setProjects((retrievedProjects ?? []) as (Project & { status?: string })[]);
	};

	return <ProjectsContext.Provider value={{ projects, fetchProjects }}>{children}</ProjectsContext.Provider>;
};
