import { Button } from '@nextui-org/button';
import style from './Home.module.css';

export default function Overview(): JSX.Element {
	return (
		<div className={style.main}>
			<h1>Home</h1>
			<Button
				color='primary'
				size='sm'
			>
				Press me
			</Button>
		</div>
	);
}
