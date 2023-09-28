import styled from '@emotion/styled';
import { ITestInfo } from './ProcessContainer';
import { useEffect, useRef } from 'react';
import axios from 'axios';

interface ITaskInfo extends ITestInfo {
	id: string;
	idx: number;
	setTasks: React.Dispatch<React.SetStateAction<ITestInfo[]>>;
	setMsg: React.Dispatch<
		React.SetStateAction<{
			type: 'running' | 'success' | 'fail';
			msg: string;
		}>
	>;
}

const SERVER_URL = 'http://localhost:8000';

const Task = ({ name, api, status, id, idx, setTasks, setMsg }: ITaskInfo) => {
	useEffect(() => {
		async function testTask() {
			setMsg({ type: 'running', msg: `Running ${name}` });
			const result = await axios.get(SERVER_URL + api + 'id=' + id);
			if (result.data) {
				console.log(name + 'api : ', result);
				setTasks(prev =>
					prev.map((task, index) =>
						task.name === name ? { ...task, status: 'success' } : idx === index ? { ...task, status: 'running' } : task
					)
				);
				setMsg({ type: 'success', msg: `${name} success` });
			} else {
				setTasks(prev => prev.map(task => (task.name === name ? { ...task, status: 'fail' } : task)));
				setMsg({ type: 'fail', msg: `${name} failed` });
			}
		}
		if (status === 'running') {
			testTask();
		}
	}, [name, idx, id, status, api, setTasks, setMsg]);
	return (
		<Container className={status} title={name}>
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
`;

export default Task;
