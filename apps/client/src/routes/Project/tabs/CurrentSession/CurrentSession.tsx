import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { Log, Session } from '@local/shared/entities';
import { useTheme } from '../../../../contexts/Theme.context';
import { useSocket } from '../../../../hooks/useSocket';
import { fetchUtil } from '../../../../utils/fetch.util';
import style from './CurrentSession.module.css';
import Logs from '../../../../components/Logs/Logs';

type CurrentSessionProps = {
	session?: Omit<Session, 'logs'>;
	isStopped: boolean;
};

const CurrentSession = ({ session, isStopped }: CurrentSessionProps) => {
	const { theme } = useTheme();

	const [logs, setLogs] = useState<Log[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		(async () => {
			if (!session || isStopped) return;

			setIsFetching(true);

			const response = await fetchUtil<Log[]>(`commandRunner/logs/${session.id}`, {
				method: 'GET'
			});

			setIsFetching(false);

			if (response?.success && response?.data) setLogs(response.data);
		})();
	}, [session, isStopped]);

	const { connect, disconnect } = useSocket<Log>({
		roomId: session?.id?.toString(),
		event: 'log',
		onEvent: (_, data) => {
			setLogs((logs) => [...logs, data]);
		}
	});

	useEffect(() => {
		if (session && !isStopped) connect();
		return () => disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, isStopped]);

	return (
		<div style={{ margin: '0 0.5rem', padding: '0.5rem' }}>
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
				<div className={style.logWrapper}>
					{isFetching && <Spinner />}
					{!isFetching && session && <Logs logs={logs} />}
				</div>
			)}
		</div>
	);
};

export default CurrentSession;
