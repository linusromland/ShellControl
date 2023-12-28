import { useState, useRef, useEffect } from 'react';
import { Avatar, Divider, Tooltip } from '@nextui-org/react';
import { startCase } from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import { useProjects } from '../../contexts/Projects.context';
import style from './Sidebar.module.css';

export default function Sidebar(): JSX.Element {
	// TODO: FIX THESE WITH ACTUAL VALUES
	const active = 2;
	const version = '1.0.0';

	const [collapsed, setCollapsed] = useState(false);
	const [width, setWidth] = useState(250);
	const [resizing, setResizing] = useState(false);
	const [showCreateProject, setShowCreateProject] = useState(false);

	const { projects, projectStatuses, fetchProjects } = useProjects();

	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (resizing) {
				const resizeWidth = e.clientX;

				if (resizeWidth < 250) {
					setCollapsed(true);
				}

				if (collapsed && resizeWidth > 250) {
					setCollapsed(false);
				}

				const max = 250;
				const min = 600;
				setWidth(Math.max(Math.min(resizeWidth, min), max));
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
	}, [collapsed, resizing]);

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
				<div className={style.title}>
					<Avatar src='favicon.png' />
					{!collapsed && (
						<div className={style.titleText}>
							<h1>ShellControl</h1>
							<p>Version {version}</p>
						</div>
					)}
				</div>

				<Divider />

				<div className={style.projects}>
					{projects.map((project) => (
						<Tooltip
							content={project.name}
							key={project.id}
							isDisabled={!collapsed}
							placement='right'
							showArrow
						>
							<div
								className={`${style.project} ${project.id === active ? style.activeProject : ''}`}
								onClick={() => console.log(project)}
							>
								<Avatar
									name={project.name}
									color={project.id === active ? (collapsed ? 'primary' : 'secondary') : 'default'}
								/>
								{!collapsed && (
									<div className={style.projectText}>
										<span>{project.name}</span>
										<span className={style.status}>
											Status:{' '}
											{startCase((projectStatuses[project.id] || 'STOPPED').toLowerCase())}
										</span>
									</div>
								)}
							</div>
						</Tooltip>
					))}
				</div>

				<Divider />

				<div className={style.actions}>
					<Tooltip
						content='Create Project'
						isDisabled={!collapsed}
						placement='right'
						showArrow
					>
						<div
							className={style.action}
							onClick={() => setShowCreateProject(true)}
						>
							<Avatar
								size='sm'
								icon={<AddIcon fontSize='small' />}
							/>
							{!collapsed && <span>Create Project</span>}
						</div>
					</Tooltip>
				</div>
			</div>

			<div
				className={style.resizeHandle}
				onMouseDown={() => setResizing(true)}
			>
				<Divider orientation='vertical' />
			</div>

			<CreateProjectModal
				isOpen={showCreateProject}
				onClose={() => setShowCreateProject(false)}
			/>
		</div>
	);
}
