import React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { ProjectsProvider } from './contexts/Projects.context';
import Router from './routes';
import './tailwind.css';
import { ThemeProvider } from './contexts/Theme.context';

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

postMessage({ payload: 'removeLoading' }, '*');

window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});
