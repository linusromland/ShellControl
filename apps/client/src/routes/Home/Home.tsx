import { useTheme } from '../../contexts/Theme.context';
import style from './Home.module.css';

const Home: React.FC = () => {
	const { theme } = useTheme();

	return (
		<div className={style.main}>
			<p
				className={style.text}
				style={{
					color: theme === 'light' ? '#666' : '#999'
				}}
			>
				Create or select a project in the sidebar to get started.
			</p>
		</div>
	);
};

export default Home;
