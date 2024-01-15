import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/Theme.context';
import Sidebar from '../Sidebar/Sidebar';
import ServerConfigModal from '../ServerConfigModal/ServerConfigModal';
import style from './Layout.module.css';

export default function Layout(): JSX.Element {
	const { theme } = useTheme();
	const navigate = useNavigate();

	window.ipcRenderer.on('navigateToProject', (_event, projectId) => {
		navigate(`/project/${projectId}`);
	});

	return (
		<ServerConfigModal>
			<div
				className={style.layout}
				style={{
					background: theme === 'light' ? '#f5f5f5' : '#1e1e1e'
				}}
			>
				<Sidebar />
				<div className={style.content}>
					<Outlet />
				</div>
			</div>
		</ServerConfigModal>
	);
}
