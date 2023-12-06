import styled from '@emotion/styled';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Generator from './components/Generator';
import ReadFile from './components/ReadFile';
import Visualizer from './components/Visualizer';
import { createRandomNumber, doOperation, doReverseOperation } from './funcs';
import Introduction from './components/Introduction';
import Deque from 'double-ended-queue';
import { useLocation } from 'react-router-dom';

const CONTAINER_WIDTH = 900;
const CONTAINER_HEIGHT = 750;
const STACK_WIDTH = 350;
const COUNT = 500;

const App = () => {
	const location = useLocation();
	const [count, setCount] = useState(COUNT);
	const [origin, setOrigin] = useState<Deque<number>>(new Deque([]));
	const [stackA, setStackA] = useState<Deque<number>>(new Deque([]));
	const [stackB, setStackB] = useState<Deque<number>>(new Deque([]));
	const [playing, setPlaying] = useState(false);
	const raqId = useRef<NodeJS.Timeout>();
	const [cmdIdx, setCmdIdx] = useState(0);
	const [speed, setSpeed] = useState(1);
	const [commands, setCommands] = useState<string[]>([]);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isNaN(Number(e.currentTarget.value))) {
			return;
		}
		setCount(Number(e.currentTarget.value));
	};

	React.useEffect(() => {
		if (playing) {
			raqId.current = setTimeout(() => {
				doOperation(commands[cmdIdx], stackA, stackB);
				setCmdIdx(cmdIdx + 1);
				setStackA(new Deque(stackA.toArray()));
				setStackB(new Deque(stackB.toArray()));
				if (cmdIdx === commands.length - 1) {
					setPlaying(false);
					clearTimeout(raqId.current);
				}
			}, speed);
		}

		return () => {
			clearTimeout(raqId.current);
		};
	}, [commands, speed, playing, stackA, stackB, cmdIdx]);
	const handlePlaying = () => {
		setPlaying(!playing);
		if (cmdIdx === commands.length) {
			setStackA(new Deque(createRandomNumber(COUNT).split(' ').reverse().map(Number)));
			setCmdIdx(0);
		}
	};

	const clickReset = () => {
		setPlaying(false);
		setCmdIdx(0);
		setStackB(new Deque());
		setStackA(new Deque(origin.toArray()));
	};
	const changeSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSpeed(Number(e.target.value));
	};

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (origin.length === 0 || commands.length === 0) return;
			if (e.key === 'a' || e.key === 'A' || e.key === 'ㅁ') {
				// 뒤로
				if (playing) setPlaying(false);
				if (cmdIdx > 0) {
					doReverseOperation(commands[cmdIdx - 1], stackA, stackB);
					setStackA(new Deque(stackA.toArray()));
					setStackB(new Deque(stackB.toArray()));
					setCmdIdx(cmdIdx - 1);
				}
			} else if (e.key === 'd' || e.key === 'D' || e.key === 'ㅇ') {
				// 앞으로
				if (playing) setPlaying(false);
				if (cmdIdx < commands.length) {
					doOperation(commands[cmdIdx], stackA, stackB);
					setStackA(new Deque(stackA.toArray()));
					setStackB(new Deque(stackB.toArray()));
					setCmdIdx(cmdIdx + 1);
				}
			} else if (e.key === 'w' || e.key === 'W' || e.key === 'ㅈ') {
				// 속도 빠르게
				if (speed < 200) setSpeed(speed + 1);
			} else if (e.key === 's' || e.key === 'S' || e.key === 'ㄴ') {
				// 속도 느리게
				if (speed > 1) setSpeed(speed - 1);
			} else if (e.key === ' ') {
				// playing, stop
				if (playing) {
					setPlaying(false);
				} else {
					setPlaying(true);
					if (cmdIdx === commands.length) {
						setCmdIdx(0);
						setStackA(new Deque(origin.toArray()));
					}
				}
			} else if (e.key === 'r' || e.key === 'R' || e.key === 'ㄱ') {
				setPlaying(false);
				setCmdIdx(0);
				setStackB(new Deque());
				setStackA(new Deque(origin.toArray()));
			}
		};
		document.body.addEventListener('keypress', handleKeyPress);

		return () => {
			document.body.removeEventListener('keypress', handleKeyPress);
		};
	});

	useEffect(() => {
		localStorage.removeItem('path');
		const beforehunloadHandler = () => {
			localStorage.setItem('path', location.pathname);
		};
		window.addEventListener('beforeunload', beforehunloadHandler);
	}, []);

	return (
		<Container>
			{(stackA.length + stackB.length === 0 || commands.length === 0) && <Introduction />}
			<Generator
				origin={origin}
				count={count}
				handleInputChange={handleInputChange}
				setStack={setStackA}
				setOrigin={setOrigin}
				setCommands={setCommands}
			/>
			<ReadFile setCommands={setCommands} />
			{stackA.length + stackB.length > 0 && commands.length > 0 && (
				<Visualizer
					height={CONTAINER_HEIGHT}
					totalWidth={CONTAINER_WIDTH}
					width={STACK_WIDTH}
					stackA={stackA}
					stackB={stackB}
					handlePlaying={handlePlaying}
					count={count}
					cmdCount={commands.length}
					commands={commands}
					cur={cmdIdx}
					second={speed}
					changeSpeed={changeSpeed}
					speed={speed}
					playing={playing}
					clickReset={clickReset}
					setPlaying={setPlaying}
					setCmdIdx={setCmdIdx}
				/>
			)}
		</Container>
	);
};

const Container = styled.div`
	width: 100vw;
	overflow: auto;
	margin: 0 auto 50px auto;
`;

export default App;
