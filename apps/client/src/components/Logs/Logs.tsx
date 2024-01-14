import { Log } from '@local/shared/entities';
import style from './Logs.module.css';
import Scrollable from '../Scrollable/Scrollable';
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useTheme } from '../../contexts/Theme.context';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TaskIcon from '@mui/icons-material/Task';
import { useState } from 'react';

type LogsProps = {
	logs: Log[];
};

const Logs = ({ logs }: LogsProps) => {
	const { theme } = useTheme();
	const [copied, setCopied] = useState('');

	const handleCopyToClipboard = (id: string, text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(id);
		setTimeout(() => setCopied(''), 2500);
	};

	return (
		<Card>
			<Scrollable
				autoScroll
				height='13rem'
				style={{ padding: '0.5rem' }}
			>
				<Table
					aria-label='Logs'
					removeWrapper
					isHeaderSticky
					classNames={{
						tr: `${style[`tableRow-${theme}`]} ${style[`tableRow`]}`,
						td: `${style[`tableCell-${theme}`]} ${style[`tableCell`]}`
					}}
				>
					<TableHeader>
						<TableColumn>Message</TableColumn>
					</TableHeader>
					<TableBody emptyContent='No logs'>
						{logs.map((log) => (
							<TableRow
								key={log.id}
								onClick={() => handleCopyToClipboard(log.id, log.message)}
							>
								<TableCell>
									<span>{log.message}</span>
									<span>
										{copied === log.id ? (
											<TaskIcon fontSize='small' />
										) : (
											<ContentCopyIcon fontSize='small' />
										)}
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Scrollable>
		</Card>
	);
};

export default Logs;
