import { useEffect, useState } from 'react';
import { Log, Session } from '@local/shared/entities';
import { useTheme } from '../../../../contexts/Theme.context';
import style from './PreviousSessions.module.css';
import Logs from '../../../../components/Logs/Logs';
import { fetchUtil } from '../../../../utils/fetch.util';

type PreviousSessionsProps = {
	sessions: Omit<Session, 'logs'>[];
};

const PreviousSessions = ({ sessions }: PreviousSessionsProps) => {
	const { theme } = useTheme();

	const [activeSession, setActiveSession] = useState<Omit<Session, 'logs'>>();
	const [logs, setLogs] = useState<Log[]>([]);

	const fetchLogs = async (sessionId: string) => {
		const res = await fetchUtil<Log[]>(`commandRunner/logs/${sessionId}`, { method: 'GET' });
		if (res.success && res.data) {
			setLogs(res.data);
		}
	};

	useEffect(() => {
		if (activeSession) {
			fetchLogs(activeSession.id);
		}
	}, [activeSession]);

	if (activeSession) {
		return (
			<>
				<p style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
					<span
						className={style.back}
						onClick={() => setActiveSession(undefined)}
					>
						← Back
					</span>
					{activeSession.createdAt}
				</p>
				<Logs logs={logs} />
			</>
		);
	}

	return (
		<>
			{sessions.length === 0 && (
				<div className={style.empty}>
					<p>No previous sessions</p>
				</div>
			)}

			{sessions.length > 0 && (
				<div className={style.sessions}>
					{sessions.map((session) => (
						<div
							className={style.session}
							key={session.id}
							onClick={() => setActiveSession(session)}
						>
							<p>{session.createdAt}</p>
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default PreviousSessions;
