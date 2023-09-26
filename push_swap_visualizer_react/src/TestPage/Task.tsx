import styled from '@emotion/styled';
import { ITestInfo } from './ProcessContainer';
import { useEffect, useRef } from 'react';
import axios from 'axios';

interface ITaskInfo extends ITestInfo {
	id: string;
	idx: number;
	setTasks: React.Dispatch<React.SetStateAction<ITestInfo[]>>;
}

const SERVER_URL = 'http://localhost:8000';

const Task = ({ name, api, status, id, idx, setTasks }: ITaskInfo) => {
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		setTimeout(async () => {
			if (containerRef.current) {
				containerRef.current.classList.add('active');

				const result = await axios.get(SERVER_URL + api + '?id=' + id);
				console.log('api : ', result);
			}
		}, 1000);
	}, []);
	return (
		<Container className={status} ref={containerRef} title={name}>
			{idx}
		</Container>
	);
};

const Container = styled.div`
	border-radius: 10px;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;
	transform: translateY(100px);
	transition: 0.5s;
	font-size: 1.25rem;
	font-weight: bold;
	width: 30px;
	height: 30px;
	&.running {
		border: 4px solid #fd9b12;
	}
	&.success {
		border: 4px solid #0bf277;
	}
	&.fail {
		border: 4px solid #ff6b6b;
	}
	&.pending {
		border: 4px solid #cfcfcf;
	}

	&.active {
		opacity: 1;
		transform: translateY(0);
	}
`;

export default Task;
