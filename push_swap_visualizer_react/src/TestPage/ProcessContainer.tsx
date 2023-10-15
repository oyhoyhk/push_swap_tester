import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import Task from './Task';
import taskData from '../Tasks.json';
import axios from 'axios';
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

export type TaskInfo = {
	state: 'pending' | 'fail' | 'success';
	stdout?: string;
	params?: number[];
	answers?: string[];
};

function convertTask(): Map<string, TaskInfo> {
	const taskList: Map<string, TaskInfo> = new Map();
	const categories = taskData.tasks;
	categories.forEach(category => {
		category.list.forEach(test => {
			taskList.set(test['name'], { state: 'pending' });
		});
	});
	return taskList;
}

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
	stdout?: string;
	params?: number[];
	answers?: string[];
}

export interface ITask {
	category: string;
	tab: 'string';
	list: {
		name: string;
		tab: string;
		api: string;
		next_api: string;
		status: string;
		stdout?: string;
		params?: number[];
		answers?: string[];
	}[];
}

const ProcessContainer = ({ id }: { id: string }) => {
	const origin = taskData['tasks'] as ITask[];
	const [tasks, setTasks] = useState<ITask[]>(origin);
	const [list, setList] = useState<Map<string, TaskInfo>>(convertTask());
	const [selected, setSelected] = useState('');

	const containerRef = useRef<HTMLDivElement>(null);
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
			tasks.map(task => ({
				...task,
				list: task.list.map(test => {
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
				tasks.map(task => ({
					...task,
					list: task.list.map(test => {
						if (test.name === curTestName) {
							const temp = new Map(list);
							const target = temp.get(test.name) as TaskInfo;
							const tempTask = Object.assign(target) as TaskInfo;
							if (response.data.stdout) {
								tempTask['stdout'] = response.data.stdout;
							}
							if (response.data.params) {
								tempTask['params'] = response.data.params;
							}
							if (response.data.answers) {
								tempTask['answers'] = response.data.answers;
							}
							tempTask['state'] = 'success';
							temp.set(test.name, tempTask);
							setList(temp);
							console.log(temp);
							return {
								...test,
								status: 'success',
								stdout: response.data.stdout,
								params: response.data.params,
								answers: response.data.answers,
							};
						} else if (test.name === nextTest) {
							return { ...test, status: 'running' };
						} else {
							return test;
						}
					}),
				}))
			);
			setSelected(curTestName);
			setMessage({ type: 'success', msg: response.data.msg });
			if (nextTest) setCurrentTest(nextTest);
			else await axios.get(import.meta.env.VITE_SERVER_URL + '/api/cleanup?id=' + id);
		} else {
			setTasks(
				tasks.map(task => ({
					...task,
					list: task.list.map(test => {
						if (test.name === curTestName) {
							const temp = new Map(list);
							const target = temp.get(test.name) as TaskInfo;
							const tempTask = Object.assign(target) as TaskInfo;
							if (response.data.stdout) {
								tempTask['stdout'] = response.data.stdout;
							}
							if (response.data.params) {
								tempTask['params'] = response.data.params;
							}
							if (response.data.answers) {
								tempTask['answers'] = response.data.answers;
							}
							tempTask['state'] = 'fail';
							temp.set(test.name, tempTask);
							setList(temp);
							console.log(temp);
							return {
								...test,
								status: 'fail',
								stdout: response.data.stdout,
								params: response.data.params,
								answers: response.data.answers,
							};
						} else {
							return test;
						}
					}),
				}))
			);
			setSelected(curTestName);
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
		<Wrapper ref={containerRef}>
			<Container>
				<legend>Unit Test Process</legend>
				<TaskContainer ref={taskContainerRef}>
					{tasks.map((task, idx) => (
						<Task key={task['category']} category={task['category']} idx={idx} list={task['list']} />
					))}
				</TaskContainer>
				<ResponseMessage className={message.type}>{message.msg}</ResponseMessage>
			</Container>
			<Response list={list} selected={selected} setSelected={setSelected} />
		</Wrapper>
	);
};

const ResponseMessage = styled.div`
	margin-top: 10px;
	margin-bottom: 20px;
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
	height: 80px;
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
`;

const Wrapper = styled.div`
	width: 570px;
	opacity: 0;
	transition: 0.5s;
	transform: translateY(100px);
	&.active {
		opacity: 1;
		transform: translateY(0);
	}
`;

export default ProcessContainer;
