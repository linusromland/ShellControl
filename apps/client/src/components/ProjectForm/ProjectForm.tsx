import { Input, Switch, Button } from '@nextui-org/react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { CreateProjectDto, UpdateProjectDto } from '@local/shared/dtos';
import style from './ProjectForm.module.css';
import { Project } from '@local/shared/entities';
import { useState } from 'react';

type CreateProjectFormProps = {
	newProject: true;
	initialValues?: undefined;
	onSave: (project: CreateProjectDto, startAfterCreate: boolean) => void;
	onDelete: undefined;
};

type UpdateProjectFormProps = {
	newProject?: false;
	initialValues: Project;
	onSave: (project: UpdateProjectDto) => void;
	onDelete: (projectId: string) => void;
};

type ProjectFormProps = CreateProjectFormProps | UpdateProjectFormProps;

export default function ProjectForm({ newProject, initialValues, onSave, onDelete }: ProjectFormProps): JSX.Element {
	const [name, setName] = useState<string>(initialValues?.name || '');
	const [description, setDescription] = useState<string>(initialValues?.description || '');
	const [directory, setDirectory] = useState<string>(initialValues?.directory || '');
	const [startCommand, setStartCommand] = useState<string>(initialValues?.startCommand || '');
	const [autoStart, setAutoStart] = useState<boolean>(initialValues?.autoStart || false);
	const [startAfterCreate, setStartAfterCreate] = useState<boolean>(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [confirmDelete, setConfirmDelete] = useState(false);

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
					isRequired={newProject}
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
					onChange={(e) => setDirectory(e.target.value)}
					isInvalid={!!errors.directory}
					errorMessage={errors.directory}
					endContent={
						<Button
							variant='flat'
							onClick={() => {
								const directory = window.ipcRenderer.sendSync('openDirectoryDialog');

								setDirectory(directory || '');
							}}
						>
							<FolderOpenIcon />
						</Button>
					}
					isRequired={newProject}
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
					isRequired={newProject}
				/>
			</div>
			<div className={style.formRow}>
				<Switch
					aria-label='Auto Start'
					isSelected={autoStart}
					onValueChange={(checked) => {
						setAutoStart(checked);

						if (checked) {
							setStartAfterCreate(true);
						}
					}}
				>
					Auto Start
				</Switch>
			</div>
			{newProject && (
				<div className={style.formRow}>
					<Switch
						aria-label='Start After Create'
						isSelected={startAfterCreate}
						onValueChange={setStartAfterCreate}
						isDisabled={autoStart}
						className={autoStart ? style.disabled : ''}
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

						// If update, just send the updated fields
						if (!newProject) {
							const updateProject: UpdateProjectDto = {};

							if (name !== initialValues?.name) {
								updateProject.name = name;
							}

							if (description !== initialValues?.description) {
								updateProject.description = description;
							}

							if (directory !== initialValues?.directory) {
								updateProject.directory = directory;
							}

							if (startCommand !== initialValues?.startCommand) {
								updateProject.startCommand = startCommand;
							}

							if (autoStart !== initialValues?.autoStart) {
								updateProject.autoStart = autoStart;
							}

							onSave(updateProject);
							return;
						}

						const createProject: CreateProjectDto = {
							name,
							description,
							directory,
							startCommand,
							autoStart
						};

						onSave(createProject, startAfterCreate);
					}}
					color='primary'
				>
					Save
				</Button>
				{!newProject && (
					<Button color="danger" onClick={() => {
						if (confirmDelete) {
							onDelete(initialValues.id.toString());
							return;
						}

						setConfirmDelete(true);
					}}>
						{confirmDelete ? 'Confirm Delete' : 'Delete'}
					</Button>
				)}
			</div>
		</>
	);
}
