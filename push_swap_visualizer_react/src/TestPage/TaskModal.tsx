import { useRecoilValue } from 'recoil';
import { modalInfoState } from '../atom';
import styled from '@emotion/styled';

const TaskModal = () => {
	const modalInfo = useRecoilValue(modalInfoState);

	if (!modalInfo) return <div />;
	return (
		<TaskInfo pos={{ x: modalInfo.xPos, y: modalInfo.yPos }} className="taskInfo">
			<Title>{modalInfo.category}</Title>
			{modalInfo.testInfo.map(task => (
				<TaskDetail key={task.name}>
					<Status className={task.status} />
					<TaskName>{task.name}</TaskName>
				</TaskDetail>
			))}
		</TaskInfo>
	);
};

const TaskInfo = styled.div<{
	pos: { x: number; y: number };
}>`
	position: fixed;
	width: 200px;
	font-size: 1.25rem;
	background: #343434;
	border: 2px solid white;
	border-radius: 5px;
	box-shadow: 0 5px 30px 10px black;
	transition: 0.3s;
	left: ${({ pos }) => `${pos.x}px`};
	top: ${({ pos }) => `${pos.y}px`};
	padding: 10px;
	z-index: 99;
`;

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

export default TaskModal;
