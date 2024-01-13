import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import dayjs from 'dayjs';
import { Log, Session } from '@local/shared/entities';
import { useTheme } from '../../../../contexts/Theme.context';
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
					<span onClick={() => setActiveSession(undefined)}>← Back</span>
					{activeSession.createdAt}
				</p>
				<Logs logs={logs} />
			</>
		);
	}

	return (
		<>
			<Table
				aria-label='Previous Sessions'
				selectionMode='single'
			>
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>STATUS</TableColumn>
					<TableColumn>CREATED AT</TableColumn>
				</TableHeader>
				<TableBody emptyContent='No previous sessions'>
					{sessions.map((session) => (
						<TableRow
							key={session.id}
							onClick={() => setActiveSession(session)}
						>
							<TableCell>{session.id}</TableCell>
							<TableCell>{session.status}</TableCell>
							<TableCell>{dayjs(session.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
};

export default PreviousSessions;
