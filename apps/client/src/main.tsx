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
		postMessage({ payload: 'removeLoading' }, '*');
	} else {
		await pollAPI(API_URL);
	}
	renderDom();
}

// Poll the api health endpoint to wait for startup
async function pollAPI(apiURL: string, index = 0) {
	if (index > 10) {
		return; // Give up after 10 tries
	}

	const res = await fetch(`${apiURL}/health`);
	if (res.status === 200) {
		postMessage({ payload: 'removeLoading' }, '*');
		return;
	}

	setTimeout(() => pollAPI(apiURL, index + 1), 2000); // Try again in 2 seconds
}

window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});
