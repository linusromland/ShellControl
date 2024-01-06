import { useEffect, useState } from 'react';
import { Log, Session } from '@local/shared/entities';
import { useTheme } from '../../../../contexts/Theme.context';
import { fetchUtil } from '../../../../utils/fetch.util';
import style from './CurrentSession.module.css';
import { Spinner } from '@nextui-org/spinner';

type CurrentSessionProps = {
	session?: Omit<Session, 'logs'>;
	isStopped: boolean;
};

const CurrentSession = ({ session, isStopped }: CurrentSessionProps) => {
	const { theme } = useTheme();

	const [logs, setLogs] = useState<Log[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	const fetchLogs = async () => {
		if (!session || !isStopped) return;

		setIsFetching(true);

		const response = await fetchUtil<Log[]>(`commandRunner/logs/${session.id}`, {
			method: 'GET'
		});

		setIsFetching(false);

		if (response?.success && response?.data) setLogs(response.data);
	};

	useEffect(() => {
		fetchLogs();
	}, [session, isStopped]);

	return (
		<>
			{isStopped ? (
				<div>
					<p
						className={style.text}
						style={{
							color: theme === 'light' ? '#666' : '#999'
						}}
					>
						Start a session to see your current session here.
					</p>
				</div>
			) : (
				<div>
					{isFetching && <Spinner />}

					{!isFetching && session && (
						<>
							<p className={style.text}>Session id: {session.id}</p>
							<p className={style.text}>Status: {session.status}</p>
							<p className={style.text}>Created: {session.createdAt}</p>
							<div>
								{logs.map((log) => (
									<p
										key={log.id}
										className={style.text}
									>
										{log.message}
									</p>
								))}
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default CurrentSession;
