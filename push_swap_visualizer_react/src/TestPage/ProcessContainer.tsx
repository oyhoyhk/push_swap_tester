import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import Task from './Task';
import taskData from '../Tasks.json';
import axios from 'axios';

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

function getAPIs(
	curTestName: string,
	tasks: {
		category: string;
		list: {
			name: string;
			api: string;
			next_api: string;
			status: string;
		}[];
	}[]
) {
	for (const task of tasks) {
		for (const test of task.list) {
			if (test.name === curTestName) return [test.api, test.next_api];
		}
	}
}

function getTestName(
	prevTestList: string[],
	api: string,
	tasks: {
		category: string;
		list: {
			name: string;
			api: string;
			next_api: string;
			status: string;
		}[];
	}[]
) {
	for (const task of tasks) {
		for (const test of task.list) {
			if (test.api === api && !prevTestList.includes(test.name)) return test.name;
		}
	}
}

export interface ITestInfo {
	name: string;
	api: string;
	next_api: string;
	status: string;
}

const ProcessContainer = ({ id }: { id: string }) => {
	const [tasks, setTasks] = useState(taskData['tasks']);

	const containerRef = useRef<HTMLFieldSetElement>(null);
	const taskContainerRef = useRef<HTMLDivElement>(null);
	const [currentTest, setCurrentTest] = useState(taskData['start']);
	const executedTestList = useRef<string[]>([]);
	const [message, setMessage] = useState({ type: 'running', msg: '' });
	const testStart = useRef(false);

	async function requestTest(curTestName: string) {
		const result = getAPIs(curTestName, tasks);
		if (!result) return;
		const [api, nextAPI] = result;
		executedTestList.current.push(curTestName);
		const nextTest = getTestName(executedTestList.current, nextAPI, tasks);
		console.log(
			`in requestTest, executedTestList.current : ${
				executedTestList.current[executedTestList.current.length - 1]
			} nextTest : ${nextTest}`
		);
		setTasks(
			tasks.map((task) => ({
				...task,
				list: task.list.map((test) => {
					if (test.name === curTestName) {
						return { ...test, status: 'running' };
					} else {
						return test;
					}
				}),
			}))
		);
		setMessage({ type: 'running', msg: `Running ${curTestName}` });
		const response = await axios.get(import.meta.env.VITE_SERVER_URL + api + id);
		console.log(curTestName, api, response.data);
		if (response.data.type) {
			setTasks(
				tasks.map((task) => ({
					...task,
					list: task.list.map((test) => {
						if (test.name === curTestName) {
							return { ...test, status: 'success', name: response.data.msg };
						} else if (test.name === nextTest) {
							return { ...test, status: 'running' };
						} else {
							return test;
						}
					}),
				}))
			);
			setMessage({ type: 'success', msg: response.data.msg });
			if (nextTest) setCurrentTest(nextTest);
			else await axios.get(import.meta.env.VITE_SERVER_URL + '/api/cleanup?id=' + id);
		} else {
			setTasks(
				tasks.map((task) => ({
					...task,
					list: task.list.map((test) => {
						if (test.name === curTestName) {
							return { ...test, status: 'fail', name: response.data.msg };
						} else {
							return test;
						}
					}),
				}))
			);
			setMessage({ type: 'fail', msg: response.data.msg });
		}
	}

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
	}, []);

	useEffect(() => {
		if (!testStart.current) {
			setTimeout(() => {
				requestTest(currentTest);
				testStart.current = true;
			}, 2000);
		} else {
			requestTest(currentTest);
		}
	}, [currentTest]);
	return (
		<Container ref={containerRef}>
			<legend>Unit Test Process</legend>
			<TaskContainer ref={taskContainerRef}>
				{tasks.map((task, idx) => (
					<Task key={task['category']} idx={idx} list={task['list']} />
				))}
			</TaskContainer>
			<Response className={message.type}>{message.msg}</Response>
		</Container>
	);
};

const Response = styled.div`
	&.running {
		color: #fd9b12;
	}
	&.success {
		color: #0bf277;
	}
	&.fail {
		color: #ff6b6b;
	}
`;

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
