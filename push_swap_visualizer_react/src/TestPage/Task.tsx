import styled from '@emotion/styled';
import { ITestInfo } from './ProcessContainer';
import { useState } from 'react';

function getCategoryStatus(list: ITestInfo[]) {
	let status = 'pending';

	for (const test of list) {
		if (test.status === 'running') return 'running';
		if (test.status === 'fail') return 'fail';
		status = test['status'];
	}
	return status;
}

const Task = ({ category, list, idx }: { category: string; list: ITestInfo[]; idx: number }) => {
	const [pos, setPos] = useState<{ x: number; y: number }>({
		x: 50,
		y: 50,
	});
	const [visible, setVisible] = useState(false);

	const handleMouseEnter = () => {
		setVisible(true);
	};

	const handleMouseOut = () => {
		setVisible(false);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setPos({
			x: e.clientX - rect.left + 10,
			y: e.clientY - rect.top + 10,
		});
	};

	return (
		<Container>
			<Text
				key={idx}
				className={getCategoryStatus(list)}
				onMouseOver={handleMouseEnter}
				onMouseMove={handleMouseMove}
				onMouseOut={handleMouseOut}
			>
				{idx + 1}
			</Text>
			<TaskInfo visible={visible} pos={pos} className="taskInfo">
				<Title>{category}</Title>
				{list.map(task => (
					<TaskDetail key={task.name}>
						<Status className={task.status} />
						<TaskName>{task.name}</TaskName>
					</TaskDetail>
				))}
			</TaskInfo>
		</Container>
	);
};

const Title = styled.div`
	margin-bottom: 10px;
`;

const TaskDetail = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 5px;
	&:last-of-type {
		margin: 0;
	}
`;

const Status = styled.div`
	width: 20px;
	height: 20px;
	border-radius: 5px;
	&.running {
		background: #fd9b12;
	}
	&.success {
		background: #0bf277;
	}
	&.fail {
		background: #ff6b6b;
	}
	&.pending {
		background: #cfcfcf;
	}
`;

const TaskName = styled.div`
	&.running {
		color: #fd9b12;
	}
	&.success {
		color: #0bf277;
	}
	&.fail {
		color: #ff6b6b;
	}
	&.pending {
		color: #cfcfcf;
	}
`;

const Text = styled.div`
	border-radius: 10px;
	box-sizing: border-box;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: 0.5s;
	font-size: 1.25rem;
	font-weight: bold;
	width: 35px;
	height: 35px;
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
		color: #cfcfcf;
	}
`;

const TaskInfo = styled.div<{
	pos: { x: number; y: number };
	visible: boolean;
}>`
	position: absolute;
	width: 300px;
	font-size: 1.25rem;
	background: #343434;
	border: 2px solid white;
	border-radius: 5px;
	box-shadow: 0 5px 30px 10px black;
	transition: 0.3s;
	opacity: ${({ visible }) => (visible ? 1 : 0)};
	left: ${({ pos }) => `${pos.x}px`};
	top: ${({ pos }) => `${pos.y}px`};
	padding: 10px;
	z-index: 3;
`;
const Container = styled.div`
	position: relative;
`;

export default Task;
