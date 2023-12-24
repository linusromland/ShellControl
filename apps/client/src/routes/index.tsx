import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Home from './Home/Home';

export default function Router(): JSX.Element {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route
						path='/'
						element={<Home />}
					/>
					<Route
						path='*'
						element={<Navigate to='/' />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
