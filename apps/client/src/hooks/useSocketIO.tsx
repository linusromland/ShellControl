import { useEffect } from 'react';
import io from 'socket.io-client';
import Storage, { StorageConfigKey } from '../utils/storage.util';

interface UseSocketIOProps {
	roomId: string;
	event: string;
	onEvent: <T>(data: T) => void;
}

const useSocketIO = ({ roomId, event, onEvent }: UseSocketIOProps) => {
	const storage = new Storage();
	const API_URL = storage.get(StorageConfigKey.API_URL);

	useEffect(() => {
		if (!API_URL) return;

		const socket = io(API_URL);
		socket.emit('joinRoom', roomId);
		socket.on(event, onEvent);

		return () => {
			socket.disconnect();
			socket.off(event, onEvent);
		};
	}, [API_URL, event, onEvent, roomId]);
};

export default useSocketIO;
