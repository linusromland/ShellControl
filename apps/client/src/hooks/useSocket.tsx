import io, { Socket } from 'socket.io-client';
import Storage, { StorageConfigKey } from '../utils/storage.util';

interface UseSocketProps<T> {
	roomId: string;
	event: string;
	onEvent: (event: string, data: T) => void;
}

interface SocketFunctions {
	connect: () => void;
	disconnect: () => void;
}

function useSocket<T>({ roomId, event, onEvent }: UseSocketProps<T>): SocketFunctions {
	const storage = new Storage();
	const API_URL = storage.get(StorageConfigKey.API_URL);
	let socket: Socket | null = null;

	const connect = (): void => {
		if (!API_URL) {
			throw new Error('API_URL not found in storage');
		}

		socket = io(API_URL);
		joinRoom();
		setupEventListeners();
	};

	const joinRoom = (): void => {
		if (socket) {
			socket.emit('joinRoom', roomId);
			console.log(`Joined room ${roomId}`);
		}
	};

	const setupEventListeners = (): void => {
		if (socket) {
			if (event === '*') {
				console.log(`Listening for all events on room ${roomId}`);
				socket.onAny(onEvent);
			} else {
				console.log(`Listening for ${event} on room ${roomId}`);
				socket.on(event, (data) => onEvent(event, data as T));
			}
		}
	};

	const disconnect = (): void => {
		if (socket) {
			socket.disconnect();

			if (event === '*') {
				socket.offAny();
			} else {
				socket.off(event);
			}

			console.log(`Disconnected from room ${roomId}`);
			socket = null;
		}
	};

	return { connect, disconnect };
}

export { useSocket };
