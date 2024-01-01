import { useState, useRef, useEffect } from 'react';
import { startCase } from 'lodash';
import { Avatar, Divider, Tooltip } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import ThemeSelector from './components/ThemeSelector/ThemeSelector';
import { useProjects } from '../../contexts/Projects.context';
import { useTheme } from '../../contexts/Theme.context';
import style from './Sidebar.module.css';

export default function Sidebar(): JSX.Element {
	// TODO: FIX THESE WITH ACTUAL VALUES
	const version = '1.0.0';

	const [collapsed, setCollapsed] = useState(false);
	const [width, setWidth] = useState(250);
	const [resizing, setResizing] = useState(false);
	const [showCreateProject, setShowCreateProject] = useState(false);

	const { projects, fetchProjects } = useProjects();
	const { theme } = useTheme();
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (resizing) {
				const resizeWidth = e.clientX;

				if (resizeWidth < 150) {
					setCollapsed(true);
				}

				if (collapsed && resizeWidth > 150) {
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
			style={{
				width,
				background: theme === 'light' ? '#fff' : '#1e1e1e',
				color: theme === 'light' ? '#000' : '#fff'
			}}
		>
			<div className={style.content}>
				<div className={`${style.title} ${collapsed ? style.collapsedTitle : ''}`}>
					<Avatar src='/favicon.png' />
					{!collapsed && (
						<div className={style.titleText}>
							<h1>ShellControl</h1>
							<p>Version {version}</p>
						</div>
					)}
				</div>

				<Divider />
				{projects.length !== 0 && (
					<>
						<div className={style.projects}>
							{projects.map((project) => {
								const isActiveProject = project.id.toString() === id;

								return (
									<Tooltip
										content={project.name}
										key={project.id}
										isDisabled={!collapsed}
										placement='right'
										showArrow
									>
										<div
											className={`${style.project} ${
												isActiveProject && !collapsed ? style.activeProject : ''
											}`}
											onClick={() => navigate(`/project/${project.id}`)}
										>
											<Avatar
												name={project.name}
												color={
													isActiveProject ? (collapsed ? 'primary' : 'secondary') : 'default'
												}
												key={project.id + isActiveProject}
											/>
											{!collapsed && (
												<div className={style.projectText}>
													<span>{project.name}</span>
													<span className={style.status}>
														Status: {startCase((project.status || 'STOPPED').toLowerCase())}
													</span>
												</div>
											)}
										</div>
									</Tooltip>
								);
							})}
						</div>

						<Divider />
					</>
				)}

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
							<Avatar icon={<AddIcon fontSize='small' />} />
							{!collapsed && <span>Create Project</span>}
						</div>
					</Tooltip>
				</div>
				<Divider />

				<div className={style.footer}>
					<ThemeSelector small={collapsed} />
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
