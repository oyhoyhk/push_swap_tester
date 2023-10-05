import styled from '@emotion/styled';
import { IStatus } from './TestPage';
import { useEffect, useRef } from 'react';
import Loader from './Loader';

const Modify = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		setTimeout(() => {
			if (containerRef.current) {
				containerRef.current.classList.add('active');
			}
		}, 100);
	}, []);
	return <ModifyContainer ref={containerRef}>Modify</ModifyContainer>;
};

const ModifyContainer = styled.div`
	position: absolute;
	right: 5%;
	top: 10px;
	border-radius: 5px;
	border: 2px solid white;
	cursor: pointer;
	padding: 5px;
	transition: 0.5s;
	filter: blur(50px);
	opacity: 0;
	&.active {
		filter: blur(0);
		opacity: 1;
	}
`;

const Fieldset = ({
	status,
	legend,
	placeholder,
	onBlur,
	onKeyUp,
}: {
	legend: string;
	placeholder: string;
	status: IStatus;
	onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
	const containerRef = useRef<HTMLFieldSetElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		setTimeout(() => {
			if (containerRef.current) {
				containerRef.current.classList.add('active');
				console.log('hi');
			}
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 500);
	}, []);
	return (
		<Container ref={containerRef}>
			<legend>{legend}</legend>
			<input
				className={status.fixed ? 'fixed' : ''}
				disabled={status.fixed}
				ref={inputRef}
				type="text"
				placeholder={placeholder}
				onBlur={onBlur}
				onKeyUp={onKeyUp}
			/>
			{status.fixed && <Modify />}
			<Message>{status.loading ? <Loader /> : <div className={status.responseType}>{status.responseMessage}</div>}</Message>
		</Container>
	);
};

const Message = styled.div`
	margin: 10px 0 20px 0;
	position: relative;
	height: 30px;
	& .success {
		color: #0bf277;
	}
	& .fail {
		color: #ff6b6b;
	}
`;

const Container = styled.fieldset`
	position: relative;
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
	opacity: 0;
	transition: 0.5s;
	transform: translateY(100px);
	&.active {
		opacity: 1;
		transform: translateY(0);
	}
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
		&.fixed {
			color: gray;
			cursor: not-allowed;
		}
	}
`;

export default Fieldset;
