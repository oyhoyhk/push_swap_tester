import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Fieldset from './Fieldset';
import ProcessContainer from './ProcessContainer';
import Response from './Response';
import TaskModal from './TaskModal';

export interface IStatus {
	check: boolean;
	value: string;
	loading: boolean;
	fixed: boolean;
	responseType: 'success' | 'fail';
	responseMessage: string;
}

export interface IStatusContainer {
	id: IStatus;
	repo: IStatus;
}

const TestPage = () => {
	const rootRef = useRef<HTMLDivElement>(null);

	const [processToggle, setProcessToggle] = useState(false);
	const [status, setStatus] = useState<IStatusContainer>({
		id: {
			check: true,
			value: '',
			fixed: false,
			loading: false,
			responseType: 'success',
			responseMessage: '',
		},
		repo: {
			check: false,
			value: '',
			fixed: false,
			loading: false,
			responseType: 'success',
			responseMessage: '',
		},
	});
	const onBlurGithubID = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === '') return;
		setStatus({ ...status, id: { ...status['id'], loading: true } });
		try {
			const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/check_github_id', {
				id: e.target.value,
			});
			const check = response.data;
			console.log(check);
			if (check == true) {
				setStatus({
					id: {
						...status['id'],
						value: e.target.value,
						loading: false,
						fixed: true,
						responseType: 'success',
						responseMessage: 'Tester Available',
					},
					repo: { ...status['repo'], check: true },
				});
			} else {
				setStatus({
					id: {
						...status['id'],
						loading: false,
						responseType: 'fail',
						responseMessage: 'Already in Test Progress',
					},
					repo: { ...status['repo'], check: false },
				});
			}
		} catch (e) {
			console.error(e);
			setStatus({
				id: {
					...status['id'],
					loading: false,
					responseType: 'fail',
					responseMessage: 'Internal Server Error...',
				},
				repo: { ...status['repo'], check: false },
			});
		}
	};
	const onKeyUpGithubID = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur();
		}
	};

	const onBlurRepo = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === '') return;
		setStatus({
			id: { ...status['id'] },
			repo: { ...status['repo'], loading: true },
		});
		try {
			const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/repository', {
				id: status['id'].value,
				repository: e.target.value,
			});
			if (response.data) {
				setStatus({
					id: { ...status['id'] },
					repo: {
						...status['repo'],
						loading: false,
						fixed: true,
						responseType: 'success',
						responseMessage: 'Repository Clone Success',
					},
				});
				setProcessToggle(true);
			} else {
				setStatus({
					id: { ...status['id'] },
					repo: {
						...status['repo'],
						loading: false,
						responseType: 'fail',
						responseMessage: 'Repository Clone Failed',
					},
				});
			}
		} catch (e) {
			console.error(e);
			setStatus({
				id: { ...status['id'] },
				repo: {
					...status['repo'],
					loading: false,
					responseType: 'fail',
					responseMessage: 'Internel Server Error',
				},
			});
		}
	};

	const onKeyUpRepo = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur();
		}
	};

	return (
		<Container ref={rootRef}>
			<ButtonContainer>
				<Button>Reset</Button>
				<Button>Retry</Button>
			</ButtonContainer>
			{status['id'].check && (
				<Fieldset
					name="id"
					status={status}
					legend="Github ID"
					placeholder="Input your github ID"
					onBlur={onBlurGithubID}
					onKeyUp={onKeyUpGithubID}
					setStatus={setStatus}
				/>
			)}
			{status['repo'].check && (
				<Fieldset
					name="repo"
					status={status}
					legend="Github Repository"
					placeholder="Input your push_swap repository URL for testing"
					onBlur={onBlurRepo}
					onKeyUp={onKeyUpRepo}
					setStatus={setStatus}
				/>
			)}
			{processToggle && status['id'].value && <ProcessContainer id={status['id'].value} />}
			<TaskModal />
		</Container>
	);
};

const Button = styled.button`
	margin-left: 15px;
	outline: none;
	padding: 10px 10px;
	border-radius: 5px;
	border: 2px solid gray;
	background: none;
	color: gray;
	cursor: pointer;
	transition: 0.5s;
	font-size: 1.1rem;
	&.active {
		border: 2px solid white;
		color: white;
	}
`;

const ButtonContainer = styled.div`
	width: 570px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

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
