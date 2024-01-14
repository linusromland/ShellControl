import { useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/react';
import { CreateProjectDto } from '@local/shared/dtos';
import { Project } from '@local/shared/entities';
import ProjectForm from '../ProjectForm/ProjectForm';
import style from './CreateProjectModal.module.css';
import { fetchUtil } from '../../utils/fetch.util';
import { useProjects } from '../../contexts/Projects.context';
import { useNavigate } from 'react-router-dom';

type CreateProjectModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps): JSX.Element {
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { fetchProjects } = useProjects();

	const handleSave = async (project: CreateProjectDto, startAfterCreate: boolean) => {
		const response = await fetchUtil<Project>('project', {
			method: 'POST',
			body: JSON.stringify(project),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.success) {
			setError(response.message);
			return;
		}

		const projectId = response.data?.id;

		if (startAfterCreate && projectId) {
			const commandRunnerResponse = await fetchUtil(`commandRunner/run/${projectId}`, {
				method: 'POST'
			});

			if (!commandRunnerResponse.success) {
				setError(commandRunnerResponse.message);
				return;
			}
		}

		fetchProjects();
		onClose();

		navigate(`/project/${projectId}`);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			placement='center'
			backdrop='blur'
		>
			<ModalContent>
				<ModalHeader>Create Project</ModalHeader>
				<ModalBody>
					<ProjectForm
						newProject
						onSave={handleSave}
					/>
					{error && <p className={style.errorText}>{error}</p>}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
