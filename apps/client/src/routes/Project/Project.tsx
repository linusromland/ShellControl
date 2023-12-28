import { useParams } from 'react-router-dom';
import style from './Project.module.css';

const Project: React.FC = () => {
	const { id } = useParams();

	return <h1>Project {id}</h1>;
};

export default Project;
