import { useEffect } from 'react';
import io from 'socket.io-client';
import Storage, { StorageConfigKey } from '../utils/storage.util';

interface UseSocketProps {
	roomId: string;
	event: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a generic
	onEvent: (event: string, data: any) => void;
}

const useSocket = ({ roomId, event, onEvent }: UseSocketProps): void => {
	useEffect(() => {
		const storage = new Storage();
		const API_URL = storage.get(StorageConfigKey.API_URL);

		if (!API_URL) return;

		const socket = io(API_URL);

		socket.emit('joinRoom', roomId);
		console.log(`Joined room ${roomId}`);

		if (event === '*') {
			console.log(`Listening for all events on room ${roomId}`);
			socket.onAny(onEvent);
			return () => {
				socket.disconnect();
				socket.offAny(onEvent);
			};
		} else {
			console.log(`Listening for ${event} on room ${roomId}`);
			socket.on(event, onEvent);
			return () => {
				socket.disconnect();
				socket.off(event, onEvent);
			};
		}
	}, [event, onEvent, roomId]);
};

export { useSocket };
