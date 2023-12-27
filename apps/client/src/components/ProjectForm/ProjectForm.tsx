import { Input, Switch, Button } from '@nextui-org/react';
import { CreateProjectDto, UpdateProjectDto } from '@local/shared/dtos';
import style from './ProjectForm.module.css';
import { Project } from '@local/shared/entities';
import { useState } from 'react';

type ProjectFormProps = {
	newProject?: boolean;
	initialValues?: Project;
	onSave: (project: CreateProjectDto | UpdateProjectDto) => void;
};

export default function ProjectForm({ newProject, initialValues, onSave }: ProjectFormProps): JSX.Element {
	const [name, setName] = useState<string>(initialValues?.name || '');
	const [description, setDescription] = useState<string>(initialValues?.description || '');
	const [directory, setDirectory] = useState<string>(initialValues?.directory || '');
	const [startCommand, setStartCommand] = useState<string>(initialValues?.startCommand || '');
	const [autoStart, setAutoStart] = useState<boolean>(initialValues?.autoStart || false);
	const [startAfterCreate, setStartAfterCreate] = useState<boolean>(false);

	const [errors, setErrors] = useState<Record<string, string>>({});

	return (
		<>
			<div className={style.formRow}>
				<Input
					aria-label='Name'
					label='Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					isInvalid={!!errors.name}
					errorMessage={errors.name}
				/>
			</div>
			<div className={style.formRow}>
				<Input
					aria-label='Description'
					label='Description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					isInvalid={!!errors.description}
					errorMessage={errors.description}
				/>
			</div>
			<div className={style.formRow}>
				<Input
					aria-label='Directory'
					label='Directory'
					value={directory}
					type='file'
					onChange={(e) => setDirectory(e.target.value)}
					isInvalid={!!errors.directory}
					errorMessage={errors.directory}
				/>
			</div>
			<div className={style.formRow}>
				<Input
					aria-label='Start Command'
					label='Start Command'
					value={startCommand}
					onChange={(e) => setStartCommand(e.target.value)}
					isInvalid={!!errors.startCommand}
					errorMessage={errors.startCommand}
				/>
			</div>
			<div className={style.formRow}>
				<Switch
					aria-label='Auto Start'
					checked={autoStart}
					onChange={(e) => setAutoStart(e.target.checked)}
				>
					Auto Start
				</Switch>
			</div>
			{newProject && (
				<div className={style.formRow}>
					<Switch
						aria-label='Start After Create'
						checked={startAfterCreate}
						onChange={(e) => setStartAfterCreate(e.target.checked)}
					>
						Start After Create
					</Switch>
				</div>
			)}

			<div className={style.formRow}>
				<Button
					onClick={() => {
						const errors: Record<string, string> = {};

						if (!name) {
							errors.name = 'Name is required';
						}

						if (!description) {
							errors.description = 'Description is required';
						}

						if (!directory) {
							errors.directory = 'Directory is required';
						}

						if (!startCommand) {
							errors.startCommand = 'Start Command is required';
						}

						if (Object.keys(errors).length) {
							setErrors(errors);
							return;
						}

						const project: CreateProjectDto | UpdateProjectDto = {
							name,
							description,
							directory,
							startCommand,
							autoStart
						};

						onSave(project);
					}}
					color='primary'
				>
					Save
				</Button>
			</div>
		</>
	);
}
