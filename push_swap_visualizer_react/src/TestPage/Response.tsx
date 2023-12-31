import styled from '@emotion/styled';
import taskList from '../Tasks.json';
import { useEffect, useRef, useState } from 'react';
import { TaskInfo } from './ProcessContainer';

const list: string[] = [];
const TEST_WIDTH = 135;
const TEST_MARGIN = 10;

taskList.tasks.forEach(target => {
	target.list.forEach(task => {
		list.push(task.name);
	});
});

const Response = ({
	list,
	selected,
	setSelected,
}: {
	list: Map<string, TaskInfo>;
	selected: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const conRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const widthRef = useRef(0);
	const [cur, setCur] = useState(0);
	const [pos, setPos] = useState(0);

	const clickTest = (name: string) => {
		if (!list.get(name)) return;
		const target = list.get(name);

		if (!target || target.state === 'pending') return;
		setSelected(name);
	};

	useEffect(() => {
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			if (e.deltaY > 0) {
				if (cur === 0) return;
				setCur(cur - 1);
				setPos(Math.max(0, pos - TEST_WIDTH - TEST_MARGIN));
			} else if (e.deltaY < 0) {
				if (cur === list.size - 1) return;
				setCur(cur + 1);
				const totalWidth = (TEST_WIDTH + TEST_MARGIN) * list.size - TEST_MARGIN;
				setPos(Math.min(pos + TEST_WIDTH + TEST_MARGIN, totalWidth - 570));
			}
		};
		const conRefTarget = conRef.current || null;
		if (conRefTarget) conRefTarget.addEventListener('wheel', onWheel);
		return () => {
			if (conRefTarget) conRefTarget.removeEventListener('wheel', onWheel);
		};
	});

	const clickCopyParams = async (type: 'params' | 'answers') => {
		const target = list.get(selected)?.[type]?.join(type === 'params' ? ' ' : '\n') || '';
		try {
			await navigator.clipboard.writeText(target);
		} catch (e) {
			console.error('copy failed', e);
		}
	};

	useEffect(() => {
		if (innerRef.current) {
			let width = 0;
			Array.from(innerRef.current.children).forEach(() => {
				width += TEST_WIDTH + TEST_MARGIN;
			});
			//  width += innerRef.current.children.length * 15;
			widthRef.current = width;
		}
	}, []);
	return (
		<Container>
			<TestWrapper ref={conRef}>
				<TestList ref={innerRef} pos={pos}>
					{Array.from(list).map(([name, info]) => (
						<div onClick={() => clickTest(name)} className={info.state} key={name}>
							{name}
						</div>
					))}
				</TestList>
			</TestWrapper>
			<ResultArea>
				<legend>Test Result</legend>
				{list.get(selected)?.stdout || ''}
				{list.get(selected)?.params && (
					<CopyComponent>
						<div>Copy Input Params</div>
						<button onClick={() => clickCopyParams('params')}>COPY</button>
					</CopyComponent>
				)}
				{list.get(selected)?.answers && (
					<CopyComponent>
						<div>Copy Your Commands</div>
						<button onClick={() => clickCopyParams('answers')}>COPY</button>
					</CopyComponent>
				)}
			</ResultArea>
		</Container>
	);
};

const CopyComponent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 10px 0;
	& > button {
		outline: none;
		border: 2px solid white;
		color: white;
		border-radius: 5px;
		background: transparent;
		padding: 5px 10px;
		cursor: pointer;
		transition: 0.5s;
		&:hover {
			color: black;
			background: white;
		}
	}
`;

const TestWrapper = styled.div`
	width: 100%;
	height: 50px;
	overflow: hidden;
`;

const TestList = styled.div<{ pos: number }>`
	white-space: nowrap;
	transition: 0.3s;
	box-sizing: border-box;
	${({ pos }) => `transform : translateX(${-pos}px)`};
	& > div {
		box-sizing: border-box;
		display: inline-block;
		width: ${TEST_WIDTH}px;
		text-align: center;
		padding: 5px 10px;
		border-radius: 10px;
		border: 2px solid white;
		margin-right: ${TEST_MARGIN}px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		transition: 0.5s;
		&.pending {
			color: gray;
			border: 2px solid gray;
			cursor: not-allowed;
		}
	}
	& > div:last-of-type {
		margin-right: 0;
	}
`;

const ResultArea = styled.fieldset`
	width: 100%;
	max-height: 250px;
	overflow: auto;
	border: 2px solid gray;
	box-sizing: border-box;
	margin-top: 25px;
	border-radius: 5px;
	padding: 10px 20px 20px 20px;
	& > legend {
		padding: 0 15px;
		font-size: 1.25rem;
		margin-left: 5px;
	}
`;

const Container = styled.div`
	box-sizing: border-box;
	border-radius: 10px;
	width: 570px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transition: 0.5s;
	margin-bottom: 60px;
	position: relative;
	margin-top: 35px;
`;

export default Response;
