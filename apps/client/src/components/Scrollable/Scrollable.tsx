import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

type ScrollableProps = {
	height: string;
	children: React.ReactNode;
	autoScroll?: boolean;
};

const Scrollable = ({ height, children, autoScroll }: ScrollableProps) => {
	const scrollableContainer = useRef<HTMLDivElement>(null);
	const [atBottom, setAtBottom] = useState(true);

	useLayoutEffect(() => {
		if (!autoScroll || !atBottom) return;

		if (scrollableContainer.current) {
			const { scrollHeight } = scrollableContainer.current;
			scrollableContainer.current.scrollTop = scrollHeight;
		}
	}, [children, autoScroll, atBottom]);

	useEffect(() => {
		const container = scrollableContainer.current;

		if (container) {
			container.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	const handleScroll = () => {
		if (!scrollableContainer.current) return;

		const { scrollHeight, clientHeight, scrollTop } = scrollableContainer.current;

		if (scrollHeight - clientHeight <= scrollTop + 100) {
			setAtBottom(true);
		} else {
			setAtBottom(false);
		}
	};

	return (
		<div
			style={{
				overflowY: 'auto',
				scrollBehavior: 'smooth',
				height: `calc(100vh - ${height})`,
				boxSizing: 'border-box'
			}}
			ref={scrollableContainer}
		>
			{children}
		</div>
	);
};

export default Scrollable;
