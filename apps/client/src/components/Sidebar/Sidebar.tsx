import { useState, useRef, useEffect } from 'react';
import { Spinner, Avatar, Button } from '@nextui-org/react';
import { Project } from '@local/shared/entities';
import style from './Sidebar.module.css';
import useApi from '../../hooks/useApi';

export default function Sidebar(): JSX.Element {
	const [collapsed, setCollapsed] = useState(false);
	const [width, setWidth] = useState(250);
	const [resizing, setResizing] = useState(false);
	const { data, error, loading } = useApi<undefined, Project[]>('GET', 'project');

	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (resizing) {
				const max = 200;
				const min = 500;
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

	const handleMouseDown = () => {
		setResizing(true);
	};

	const handleToggleCollapse = () => {
		setCollapsed(!collapsed);
	};

	return (
		<div
			ref={sidebarRef}
			className={`${style.sidebar} ${collapsed ? style.collapsed : ''}`}
			style={{ width }}
		>
			<Button
				flat
				auto
				circle
				className={style.toggle}
				onClick={handleToggleCollapse}
			>
				{collapsed ? '>' : '<'}
			</Button>
			<div className={style.content}>
				<h1>ShellControl</h1>
				{loading && <Spinner />}
				{error && <p>{error as unknown as string}</p>}
				{!loading && data && (
					<ul>
						{data.data.map((project) => (
							<li
								key={project.id}
								className={style.projectItem}
							>
								<Avatar src={project.icon} />
								<span>{project.name}</span>
							</li>
						))}
					</ul>
				)}
			</div>
			<div
				className={style.resizeHandle}
				onMouseDown={handleMouseDown}
			/>
		</div>
	);
}
