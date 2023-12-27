import { Modal, ModalContent, ModalBody, ModalFooter, Input, Button, ModalHeader, Code } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import Storage, { StorageConfigKey } from '../../utils/storage.util';

type ServerConfigModalProps = {
	children?: JSX.Element | JSX.Element[];
};

export default function ServerConfigModal({ children }: ServerConfigModalProps): JSX.Element {
	const [isOpen, setIsOpen] = useState(true);
	const [url, setUrl] = useState('http://localhost:3000');
	const [error, setError] = useState('');

	const getStoredURL = useCallback(async () => {
		const storage = new Storage();
		const apiURL = storage.get(StorageConfigKey.API_URL);
		if (apiURL) {
			setUrl(apiURL);
			const validURL = await verifyURL(apiURL);
			setIsOpen(!validURL);
		}
		setError('');
	}, []);

	const verifyURL = async (url?: string) => {
		if (!url) return false;

		const res = await fetch(`${url}/health`);
		return res.ok;
	};

	const handleSave = async () => {
		// Check if url is valid url
		const regex = new RegExp('^(http|https)://', 'i');

		if (!regex.test(url)) {
			setError('Invalid URL');
			return;
		}

		const validURL = await verifyURL(url);
		if (!validURL) {
			setError('Invalid URL or server is not running');
			return;
		}

		const storage = new Storage();
		storage.set(StorageConfigKey.API_URL, url);

		getStoredURL();
	};

	useEffect(() => {
		getStoredURL();
	}, [getStoredURL]);

	if (!isOpen) return <>{children}</>;

	return (
		<Modal
			isOpen
			placement='center'
			isDismissable={false}
			backdrop='blur'
			hideCloseButton
		>
			<ModalContent>
				<ModalHeader>Server Configuration</ModalHeader>
				<ModalBody>
					<p>
						Enter the URL of the server you want to connect to.
						<br />
						This is usually <Code>http://localhost:3000</Code> if you are running this locally.
					</p>
					<Input
						aria-label='URL'
						label='URL'
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						isInvalid={!!error}
						errorMessage={error}
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						color='primary'
						onClick={handleSave}
						disabled={!url}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
