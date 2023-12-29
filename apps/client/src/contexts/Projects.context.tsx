import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@local/shared/entities';
import { fetchUtil } from '../utils/fetch.util';

interface ProjectsContextProps {
	projects: Project[];
	projectStatuses: Record<number, string>;
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
	const [projects, setProjects] = useState<Project[]>([]);
	const [projectStatuses, setProjectStatuses] = useState<Record<number, string>>({});

	const fetchProjects = async (): Promise<void> => {
		const response = await fetchUtil<Project[]>('project', {
			method: 'GET'
		});

		if (!response.success) throw new Error(response.message);

		setProjects(response.data || []);

		const getStatusPromises = response.data?.map((project) => getProjectStatus(project.id));
		await Promise.all(getStatusPromises || []);
	};

	// TODO: ADD WS SOCKETIO THING HERE FOR THE PROJECT STATUSES

	const getProjectStatus = async (projectId: number) => {
		const response = await fetchUtil<string>(`commandRunner/status/${projectId}`, {
			method: 'GET'
		});

		if (!response.success) throw new Error(response.message);

		const status = response.data || 'STOPPED';

		setProjectStatuses((prev) => ({
			...prev,
			[projectId]: status
		}));
	};

	return (
		<ProjectsContext.Provider value={{ projects, projectStatuses, fetchProjects }}>
			{children}
		</ProjectsContext.Provider>
	);
};
