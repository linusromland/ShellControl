import React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { ProjectsProvider } from './contexts/Projects.context';
import { ThemeProvider } from './contexts/Theme.context';
import Storage, { StorageConfigKey } from './utils/storage.util';
import Router from './routes';
import './tailwind.css';
import './main.css';

function renderDom() {
	ReactDOM.createRoot(document.getElementById('root')!).render(
		<React.StrictMode>
			<NextUIProvider>
				<ProjectsProvider>
					<ThemeProvider>
						<Router />
					</ThemeProvider>
				</ProjectsProvider>
			</NextUIProvider>
		</React.StrictMode>
	);
}

checkAPI();

async function checkAPI() {
	const storage = new Storage();
	const API_URL = storage.get(StorageConfigKey.API_URL);

	if (!API_URL) {
		console.log('No API URL set, continuing anyway');
		postMessage({ payload: 'removeLoading' }, '*');
		renderDom();
		return;
	}
	await pollAPI(API_URL);
}

// Poll the api health endpoint to wait for startup
async function pollAPI(apiURL: string, index = 0) {
	console.log('Checking if API is up, attempt', index);

	if (index >= 5) {
		console.log('Failed to connect to API, continuing anyway');
		postMessage({ payload: 'removeLoading' }, '*');
		renderDom();
		return; // Give up after 10 tries
	}
	try {
		const res = await fetch(`${apiURL}/health`);
		if (res.status === 200) {
			console.log('API is up, continuing');
			postMessage({ payload: 'removeLoading' }, '*');
			renderDom();
			return;
		}
	} catch (_) {
		console.log('API is not up yet, trying again');
	}

	setTimeout(() => pollAPI(apiURL, index + 1), 2000); // Try again in 2 seconds
}

window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});
