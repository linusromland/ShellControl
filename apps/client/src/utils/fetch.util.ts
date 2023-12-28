import { Response } from '@local/shared/types';
import Storage, { StorageConfigKey } from './storage.util';

export async function fetchUtil<Res>(path: string, requestOptions: RequestInit): Promise<Response<Res | undefined>> {
	const storage = new Storage();
	const API_URL = storage.get(StorageConfigKey.API_URL);

	const url = `${API_URL}/${path}`;

	const request = await fetch(url, requestOptions);

	const response = await request.json();

	return response;
}
