import { Avatar, Select, SelectItem, Tooltip } from '@nextui-org/react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import { startCase } from 'lodash';
import { useTheme } from '../../../../contexts/Theme.context';
import style from './ThemeSelector.module.css';

type ThemeSelectorProps = {
	small?: boolean;
};

export default function ThemeSelector({ small }: ThemeSelectorProps) {
	const { setTheme, activeTheme, theme } = useTheme();

	if (small) {
		return (
			<Tooltip
				content={`Theme: ${startCase(activeTheme)}`}
				placement='right'
				showArrow
			>
				<div
					className={`${style[`action-${theme}`]} ${style.action}`}
					onClick={() => {
						if (activeTheme === 'light') {
							setTheme('dark');
						} else if (activeTheme === 'dark') {
							setTheme('auto');
						} else {
							setTheme('light');
						}
					}}
				>
					<Avatar
						key={activeTheme}
						icon={
							activeTheme === 'light' ? (
								<LightModeIcon fontSize='small' />
							) : activeTheme === 'dark' ? (
								<DarkModeIcon fontSize='small' />
							) : (
								<BrightnessAutoIcon fontSize='small' />
							)
						}
					/>
				</div>
			</Tooltip>
		);
	}

	return (
		<Select
			aria-label='Theme'
			selectedKeys={[activeTheme]}
			startContent={
				activeTheme === 'light' ? (
					<LightModeIcon />
				) : activeTheme === 'dark' ? (
					<DarkModeIcon />
				) : (
					<BrightnessAutoIcon />
				)
			}
			size='sm'
		>
			<SelectItem
				aria-label='Light'
				key='light'
				onClick={() => setTheme('light')}
				startContent={<LightModeIcon />}
			>
				Light
			</SelectItem>
			<SelectItem
				aria-label='Dark'
				key='dark'
				onClick={() => setTheme('dark')}
				startContent={<DarkModeIcon />}
			>
				Dark
			</SelectItem>
			<SelectItem
				aria-label='Auto'
				key='auto'
				onClick={() => setTheme('auto')}
				startContent={<BrightnessAutoIcon />}
			>
				Auto
			</SelectItem>
		</Select>
	);
}
