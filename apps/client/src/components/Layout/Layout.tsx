import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import style from './Layout.module.css';

export default function Layout(): JSX.Element {
	return (
		<div className={style.layout}>
			<Sidebar />
			<div className={style.content}>
				<Outlet />
			</div>
		</div>
	);
}
