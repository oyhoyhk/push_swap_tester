import styled from '@emotion/styled';
import { IStatusContainer } from './TestPage';
import { useEffect, useRef, useState } from 'react';
import Loader from './Loader';

const Fieldset = ({
	name,
	status,
	legend,
	placeholder,
	onBlur,
	onKeyUp,
	setStatus,
}: {
	name: 'id' | 'repo';
	legend: string;
	placeholder: string;
	status: IStatusContainer;
	onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	setStatus: React.Dispatch<React.SetStateAction<IStatusContainer>>;
}) => {
	const containerRef = useRef<HTMLFieldSetElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [modal, setModal] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			if (containerRef.current) {
				containerRef.current.classList.add('active');
			}
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 500);
	}, []);

	const clickToModify = () => {
		if (status[name].fixed) setModal(true);
	};
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name as 'id' | 'repo';
		setStatus({
			...status,
			[name]: {
				...status[name],
				value: e.target.value,
			},
		});
	};

	return (
		<Container ref={containerRef}>
			<legend>{legend}</legend>
			<InnerContainer className={modal ? 'toggle' : ''}>
				<input
					ref={inputRef}
					name={name}
					type="text"
					value={status[name].value}
					placeholder={placeholder}
					onBlur={onBlur}
					onKeyUp={onKeyUp}
					onClick={clickToModify}
					onChange={onChange}
				/>
				<Message>
					{status[name].loading ? <Loader /> : <div className={status[name].responseType}>{status[name].responseMessage}</div>}
				</Message>
			</InnerContainer>
		</Container>
	);
};

const InnerContainer = styled.div`
	width: 100%;
	transition: 0.5s cubic-bezier(0.17, 0.67, 0.8, 1.12);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 112px;

	& > input {
		width: 90%;
		height: 40px;
		margin: 10px auto;
		border: none;
		outline: none;
		background: transparent;
		border-bottom: 2px solid gray;
		text-align: center;
		cursor: pointer;
		font-size: 1.25rem;
		&:focus {
			border-bottom: 2px solid white;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			& > .text {
				font-size: 1.5rem;
			}
			& > .subText {
				font-size: 0.9rem;
				color: gray;
			}
			& > .buttonContainer {
				margin-top: 15px;
				& > button {
					background: none;
					outline: none;
					border: 2px solid gray;
					color: gray;
					border-radius: 5px;
					padding: 5px 10px;
					cursor: pointer;
					&:first-of-type {
						margin-right: 20px;
						border: 2px solid white;
						color: white;
					}
				}
			}
		}
		color: white;
		&.fixed {
			color: gray;
			cursor: not-allowed;
		}
	}
`;

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
	height: 150px;
	padding: 0;
	margin: 15px auto;
	overflow: hidden;
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
`;

export default Fieldset;
