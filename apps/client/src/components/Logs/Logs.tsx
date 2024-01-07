import { useEffect, useRef } from 'react';
import { Log } from '@local/shared/entities';
import style from './Logs.module.css';

type LogsProps = {
	logs: Log[];
};

const Logs = ({ logs }: LogsProps) => {
	const logWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (logWrapperRef.current) {
			const { scrollHeight, clientHeight, scrollTop } = logWrapperRef.current;

			if (scrollHeight - clientHeight <= scrollTop + 100) {
				logWrapperRef.current.scrollTop = scrollHeight;
			}
		}
	}, [logs]);

	return (
		<div
			className={style.logs}
			ref={logWrapperRef}
		>
			{logs.map((log) => (
				<p
					key={log.id}
					className={style.text}
				>
					{log.message}
				</p>
			))}
		</div>
	);
};

export default Logs;
