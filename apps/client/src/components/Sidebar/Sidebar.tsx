import { useState, useRef, useEffect } from 'react';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import { useProjects } from '../../context/Projects.context';
import style from './Sidebar.module.css';

dayjs.extend(relativeTime);

export default function Sidebar(): JSX.Element {
	const [collapsed] = useState(false);
	const [width, setWidth] = useState(250);
	const [resizing, setResizing] = useState(false);
	const [showCreateProject, setShowCreateProject] = useState(false);

	const { projects, fetchProjects } = useProjects();

	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (resizing) {
				const max = 250;
				const min = 600;
				setWidth(Math.max(Math.min(e.clientX, min), max));
			}
		};

		const handleMouseUp = () => {
			setResizing(false);
		};

		if (resizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [resizing]);

	useEffect(() => {
		fetchProjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			ref={sidebarRef}
			className={`${style.sidebar} ${collapsed ? style.collapsed : ''}`}
			style={{ width }}
		>
			<div className={style.content}>
				<h1 className={style.title}>ShellControl</h1>
				{projects && (
					<Listbox>
						<ListboxSection
							title='Projects'
							showDivider
						>
							{projects.map((project) => (
								<ListboxItem
									key={project.id}
									className={style.listboxItem}
									textValue={project.name}
								>
									<span>{project.name}</span>
									<span>{dayjs(project.createdAt).fromNow()}</span>
								</ListboxItem>
							))}
						</ListboxSection>
						<ListboxItem
							key='create-project'
							textValue='New Project'
							onClick={() => setShowCreateProject(true)}
						>
							<span>New Project</span>
						</ListboxItem>
					</Listbox>
				)}
			</div>
			<div
				className={style.resizeHandle}
				onMouseDown={() => {
					setResizing(true);
				}}
			/>

			<CreateProjectModal
				isOpen={showCreateProject}
				onClose={() => setShowCreateProject(false)}
			/>
		</div>
	);
}
