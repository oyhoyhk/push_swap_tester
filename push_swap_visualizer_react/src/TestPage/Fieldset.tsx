import styled from '@emotion/styled';
import axios from 'axios';
import { IStatus } from './TestPage';
import { useEffect, useRef } from 'react';

const Fieldset = ({
	status,
	legend,
	placeholder,
	errMsg,
	onBlur,
	onKeyUp,
}: {
	legend: string;
	placeholder: string;
	errMsg: string;
	status: IStatus;
	onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
	const containerRef = useRef<HTMLFieldSetElement>(null);

	useEffect(() => {
		setTimeout(() => {
			if (containerRef.current) {
				containerRef.current.classList.add('active');
				console.log('hi');
			}
		}, 500);
	}, []);
	return (
		<Container ref={containerRef}>
			<legend>{legend}</legend>
			<input type="text" placeholder={placeholder} onBlur={onBlur} onKeyUp={onKeyUp} />
			<Message>{errMsg}</Message>
		</Container>
	);
};

const Message = styled.div`
	margin: 10px 0 20px 0;
`;

const Container = styled.fieldset`
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
	}
`;

export default Fieldset;
