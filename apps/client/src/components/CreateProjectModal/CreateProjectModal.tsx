import { useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/react';
import ProjectForm from '../ProjectForm/ProjectForm';
import { CreateProjectDto } from '@local/shared/dtos';
import style from './CreateProjectModal.module.css';
import { fetchUtil } from '../../utils/fetch.util';
import { Project } from '@local/shared/entities';

type CreateProjectModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps): JSX.Element {
	const [error, setError] = useState('');

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

		// Todo: navigate to project page
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
