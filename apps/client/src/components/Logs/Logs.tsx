import { Log } from '@local/shared/entities';
import style from './Logs.module.css';
import Scrollable from '../Scrollable/Scrollable';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useTheme } from '../../contexts/Theme.context';

type LogsProps = {
	logs: Log[];
};

const Logs = ({ logs }: LogsProps) => {
	const { theme } = useTheme();

	return (
		<Scrollable
			height='9rem'
			autoScroll
		>
			<Table aria-label='Logs'>
				<TableHeader>
					<TableColumn>Message</TableColumn>
				</TableHeader>
				<TableBody emptyContent='No logs'>
					{logs.map((log) => (
						<TableRow key={log.id}>
							<TableCell className={style[`tableCell-${theme}`]}>{log.message}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Scrollable>
	);
};

export default Logs;
