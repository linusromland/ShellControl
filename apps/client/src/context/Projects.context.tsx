import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@local/shared/entities';
import { fetchUtil } from '../utils/fetch.util';

interface ProjectsContextProps {
	projects: Project[];
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

	const fetchProjects = async (): Promise<void> => {
		const response = await fetchUtil<Project[]>('project', {
			method: 'GET'
		});

		if (!response.success) throw new Error(response.message);

		setProjects(response.data || []);
	};

	return <ProjectsContext.Provider value={{ projects, fetchProjects }}>{children}</ProjectsContext.Provider>;
};
