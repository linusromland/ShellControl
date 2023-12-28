import React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { ProjectsProvider } from './context/Projects.context';
import Router from './routes';
import './tailwind.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<NextUIProvider>
			<ProjectsProvider>
				<Router />
			</ProjectsProvider>
		</NextUIProvider>
	</React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');

window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});
