import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table';
import { Spinner } from '@nextui-org/spinner';
import { Project } from '@local/shared/entities';
import useApi from '../../hooks/useApi';
import style from './Home.module.css';

export default function Overview(): JSX.Element {
	const { data, error, loading } = useApi<undefined, Project[]>('GET', 'project');

	console.log(data);

	return (
		<div className={style.main}>
			<h1>Home</h1>

			{loading && <Spinner />}
			{error && <p>{error as unknown as string}</p>}
			{!loading && data && (
				<Table>
					<TableHeader>
						<TableColumn>Name</TableColumn>
						<TableColumn>Description</TableColumn>
						<TableColumn>Created</TableColumn>
					</TableHeader>
					<TableBody>
						{data.data.map((project) => (
							<TableRow key={project.id}>
								<TableCell>{project.name}</TableCell>
								<TableCell>{project.description}</TableCell>
								<TableCell>{project.createdAt}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
