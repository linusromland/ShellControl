import { useEffect, useState } from 'react';
import env from '../utils/env.util';
import { Response } from '@local/shared/types';

function useApi<Req, Res>(method: string, path: string, body?: Req) {
	const [data, setData] = useState<Response<Res>>();
	const [error, setError] = useState<Error>();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setData(undefined);
		setError(undefined);

		const fetchData = async () => {
			const requestMethod = method?.toLowerCase() ?? 'get';

			const requestOptions: RequestInit = {
				method: requestMethod,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			let url = `${env.API_URL}/${path}`;

			if (['get', 'delete'].includes(requestMethod)) {
				if (body) {
					const queryParams = new URLSearchParams(body as Record<string, string>);
					url += `?${queryParams.toString()}`;
				}
			} else {
				requestOptions.body = JSON.stringify(body);
			}

			try {
				setLoading(true);
				const response = await fetch(url, requestOptions);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const result: Response<Res> = await response.json();
				setData(result);
			} catch (e) {
				console.error(e);
				setError(e as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		return () => {};
	}, [method, path, body]);

	return { data, error, loading };
}

export default useApi;
