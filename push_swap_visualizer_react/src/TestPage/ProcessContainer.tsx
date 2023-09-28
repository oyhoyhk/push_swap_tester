import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import Task from './Task';
import Response from './Response';

/*
  Mandetory test 목록
  1. make 잘 되는지, re-link 일어나는지
    * push_swap 프로그램이 잘 생성 되었는지
    * make re
    * make clean
    * make fclean
  2. push_swap 인자 없이 실행 했을 때
  3. 
*/

export interface ITestInfo {
	name: string;
	api: string;
	status: 'running' | 'success' | 'fail' | 'pending';
}

const ProcessContainer = ({ id }: { id: string }) => {
	const [tasks, setTasks] = useState<ITestInfo[]>([
		{ name: 'Compile Test', api: '/api/compile_test?', status: 'pending' },
		{ name: 'Exception Handling Test', api: '/api/exception_handling_test?', status: 'pending' },
		{ name: 'Handling 5 params Test', api: '/api/push_swap_test?param_count=5&', status: 'pending' },
		{ name: 'Handling 100 params Test', api: '/api/push_swap_test?param_count=100&', status: 'pending' },
		{ name: 'Handling 500 params Test', api: '/api/push_swap_test?param_count=500&', status: 'pending' },
	]);
	const [responseMessage, setResponseMessage] = useState<{ type: 'running' | 'success' | 'fail'; msg: string }>({
		type: 'running',
		msg: '',
	});

	const containerRef = useRef<HTMLFieldSetElement>(null);
	const taskContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			if (containerRef.current) {
				containerRef.current.classList.add('active');
			}
		}, 500);
		setTimeout(() => {
			if (taskContainerRef.current) {
				taskContainerRef.current.classList.add('active');
			}
		}, 1000);
		setTimeout(() => {
			setTasks(tasks.map((task, idx) => (idx === 0 ? { ...task, status: 'running' } : task)));
		}, 1500);
	}, []);
	return (
		<Container ref={containerRef}>
			<legend>Unit Test Process</legend>
			<TaskContainer ref={taskContainerRef}>
				{tasks.map((task, idx) => (
					<Task key={task.name} {...task} id={id} idx={idx + 1} setTasks={setTasks} setMsg={setResponseMessage} />
				))}
			</TaskContainer>
			<Response {...responseMessage} />
		</Container>
	);
};

const TaskContainer = styled.div`
	width: 90%;
	height: 100px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	opacity: 0;
	transition: 0.5s;
	transform: translateY(100px);
	&.active {
		opacity: 1;
		transform: translateY(0);
	}
`;

const Container = styled.fieldset`
	border-radius: 10px;
	width: 570px;
	height: 190px;
	padding: 0;
	margin: 15px auto;
	& > legend {
		padding: 0 15px;
		font-size: 1.5rem;
		margin-left: 20px;
	}
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	opacity: 0;
	transition: 0.5s;
	transform: translateY(100px);
	&.active {
		opacity: 1;
		transform: translateY(0);
	}
`;

export default ProcessContainer;
