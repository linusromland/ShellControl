import { useEffect, useState } from 'react';
import {
	BreadcrumbItem,
	Breadcrumbs,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Card
} from '@nextui-org/react';
import dayjs from 'dayjs';
import { Log, Session } from '@local/shared/entities';
import { useTheme } from '../../../../contexts/Theme.context';
import Logs from '../../../../components/Logs/Logs';
import { fetchUtil } from '../../../../utils/fetch.util';
import style from './PreviousSessions.module.css';
import Scrollable from '../../../../components/Scrollable/Scrollable';

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
			<Card style={{ margin: '0 0.5rem' }}>
				<Breadcrumbs
					variant='solid'
					style={{ padding: '0.5rem' }}
				>
					<BreadcrumbItem onClick={() => setActiveSession(undefined)}>Sessions</BreadcrumbItem>
					<BreadcrumbItem>{dayjs(activeSession.createdAt).format('YYYY-MM-DD HH:mm')}</BreadcrumbItem>
				</Breadcrumbs>

				<Logs logs={logs} />
			</Card>
		);
	}

	return (
		<Card style={{ margin: '0 0.5rem', padding: '0.5rem' }}>
			<Scrollable
				height='11rem'
				style={{ padding: '0.5rem' }}
			>
				<Table
					aria-label='Previous Sessions'
					removeWrapper
					isHeaderSticky
					classNames={{
						tr: `${style[`tableRow-${theme}`]} ${style[`tableRow`]}`,
						td: `${style[`tableCell-${theme}`]} ${style[`tableCell`]}`
					}}
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
			</Scrollable>
		</Card>
	);
};

export default PreviousSessions;
