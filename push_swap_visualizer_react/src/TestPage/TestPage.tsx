import styled from '@emotion/styled';
import axios from 'axios';

const SERVER_URL = 'http://localhost:8000';

const TestPage = () => {
	const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
		axios.post(SERVER_URL + '/api/check_github_id', { id: e.target.value }).then((res) => console.log(res));
	};
	const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur();
		}
	};
	return (
		<Container>
			<fieldset>
				<legend>Intra ID</legend>
				<input type="text" placeholder="Input your github ID" onBlur={onBlur} onKeyUp={onKeyUp} />
				<Message>Available using Tester</Message>
			</fieldset>
			<fieldset>
				<legend>Github Repository</legend>
				<input type="text" placeholder="Input your github ID" onBlur={onBlur} onKeyUp={onKeyUp} />
				<Message>Available using Tester</Message>
			</fieldset>
			<fieldset>
				<legend>Test Process</legend>
			</fieldset>
		</Container>
	);
};

const Message = styled.div`
	margin: 10px 0 20px 0;
`;

const Container = styled.div`
	& > fieldset {
		border-radius: 10px;
		width: 570px;
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
		& > input {
			width: 90%;
			height: 40px;
			margin: 10px auto;
			border: none;
			outline: none;
			background: transparent;
			border-bottom: 2px solid gray;
			text-align: center;
			font-size: 1.25rem;
			&:focus {
				border-bottom: 2px solid white;
			}
			color: white;
		}
	}
`;

export default TestPage;
