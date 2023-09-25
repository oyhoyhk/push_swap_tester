import styled from '@emotion/styled';
import axios from 'axios';
import { useState } from 'react';
import Fieldset from './FieldSet';

const SERVER_URL = 'http://localhost:8000';

export interface IStatus {
	check: boolean;
	value: string | null;
}
export interface IStatusContainer {
	[key: string]: IStatus;
}

const TestPage = () => {
	const [status, setStatus] = useState<IStatusContainer>({ id: { check: true, value: null }, repo: { check: false, value: null } });
	const onBlurGithubID = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const response = await axios.post(SERVER_URL + '/api/check_github_id', { id: e.target.value });
		const check = response.data;
		console.log(check);
	};
	const onKeyUpGithubID = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur();
		}
	};
	return (
		<Container>
			<Fieldset
				status={status['id']}
				legend="Github ID"
				placeholder="Input your github ID"
				errMsg="Available"
				onBlur={onBlurGithubID}
				onKeyUp={onKeyUpGithubID}
			/>
			<Fieldset
				status={status['repo']}
				legend="Github Repository"
				placeholder="Input your push_swap repository URL for testing"
				errMsg="Available"
			/>
			<fieldset>
				<legend>Test Process</legend>
			</fieldset>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transition: 0.5s;

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
`;

export default TestPage;
