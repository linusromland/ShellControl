import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextProps {
	setTheme: (theme: 'light' | 'dark' | 'auto') => void;
	theme: 'light' | 'dark';
	activeTheme: 'light' | 'dark' | 'auto';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [theme, setThemeState] = useState<'light' | 'dark'>('light');
	const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'auto'>('auto');

	const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
		setActiveTheme(newTheme);
	};

	useEffect(() => {
		if (activeTheme === 'auto') {
			const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

			setThemeState(prefersDarkScheme ? 'dark' : 'light');

			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
				setThemeState(event.matches ? 'dark' : 'light');
			});

			return () => {
				window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {});
			};
		} else {
			setThemeState(activeTheme);
		}
	}, [activeTheme]);

	return <ThemeContext.Provider value={{ setTheme, theme, activeTheme }}>{children}</ThemeContext.Provider>;
};
