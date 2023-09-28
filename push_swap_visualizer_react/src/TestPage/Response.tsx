import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';

const Response = ({ type, msg }: { type: 'running' | 'success' | 'fail'; msg: string }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		console.log('msg : ', msg);
		setTimeout(() => {
			const temp = containerRef.current as HTMLDivElement;
			if (containerRef.current) {
				containerRef.current.classList.add('active');
			}
		});
	}, [msg]);
	return (
		<Container ref={containerRef} className={type}>
			{msg}
		</Container>
	);
};

const Container = styled.div`
	transition: 0.5s;
	opacity: 0;
	transform: translateY(100px);
	&.active {
		opacity: 1;
		transform: translateY(0);
	}
	&.leave {
		opacity: 0;
		transform: translateY(-100px);
	}
	&.running {
		color: gray;
	}
	&.success {
		color: #0bf277;
	}
	&.fail {
		color: #ff6b6b;
	}
`;

export default Response;
