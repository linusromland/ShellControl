import { Log } from '@local/shared/entities';
import style from './Logs.module.css';
import Scrollable from '../Scrollable/Scrollable';

type LogsProps = {
	logs: Log[];
};

const Logs = ({ logs }: LogsProps) => {
	return (
		<Scrollable
			height='9rem'
			autoScroll
		>
			{logs.map((log) => (
				<p
					key={log.id}
					className={style.text}
				>
					{log.message}
				</p>
			))}
		</Scrollable>
	);
};

export default Logs;
