import { useState } from 'react';
import { Session } from '@local/shared/entities';
import { useTheme } from '../../../../contexts/Theme.context';
import style from './PreviousSessions.module.css';
import Logs from '../../../../components/Logs/Logs';

type PreviousSessionsProps = {
	sessions: Omit<Session, 'logs'>[];
};

const PreviousSessions = ({ sessions }: PreviousSessionsProps) => {
	const { theme } = useTheme();

	const [activeSession, setActiveSession] = useState<Omit<Session, 'logs'>>();

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
				<Logs logs={[]} />
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
