import styled from '@emotion/styled';
import { ITestInfo } from './ProcessContainer';
import { useSetRecoilState } from 'recoil';
import { modalInfoState } from '../atom';

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
	const setModalInfo = useSetRecoilState(modalInfoState);

	const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		setModalInfo({
			xPos: e.clientX + 5,
			yPos: e.clientY + 20,
			category: category,
			testInfo: list,
		});
	};

	const handleMouseOut = () => {
		setModalInfo(null);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		setModalInfo({
			xPos: e.clientX + 5,
			yPos: e.clientY + 20,
			category: category,
			testInfo: list,
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
		</Container>
	);
};

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

const Container = styled.div`
	position: relative;
`;

export default Task;
