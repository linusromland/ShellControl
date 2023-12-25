import style from './Home.module.css';

const Home: React.FC = () => {
	return (
		<div className={style.main}>
			<p className={style.text}>Create or select a project in the sidebar to get started.</p>
		</div>
	);
};

export default Home;
