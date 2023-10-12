import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { ITask } from './ProcessContainer';

const Response = ({ tasks }: { tasks: ITask[] }) => {
	const [current, setCurrent] = useState<{ tabIndex: number; innerTabIndex: number }>({ tabIndex: 0, innerTabIndex: 0 });

	return (
		<Container>
			<Tabs>
				{tasks &&
					tasks.map((info, idx) => (
						<div
							onClick={() => setCurrent({ tabIndex: idx, innerTabIndex: 0 })}
							className={idx === current['tabIndex'] ? 'active' : ''}
							key={info.category}
						>
							{info.tab}
						</div>
					))}
			</Tabs>
			<InnerTabs childCount={tasks ? tasks[current['tabIndex']].list.length : 0}>
				{tasks &&
					tasks[current['tabIndex']].list.map((info, idx) => (
						<div
							key={info.tab}
							onClick={() => setCurrent({ ...current, innerTabIndex: idx })}
							className={info.status === 'pending' ? 'pending' : idx === current['innerTabIndex'] ? 'active' : ''}
						>
							{info.tab}
						</div>
					))}
			</InnerTabs>
			<ResultArea>
				<legend>Test Result</legend>
				<div>{tasks[current['tabIndex']].list[current['innerTabIndex']].stdout ?? 'text'}</div>
			</ResultArea>
		</Container>
	);
};

const ResultArea = styled.fieldset`
	width: 100%;
	height: 300px;
	border: 2px solid gray;
	box-sizing: border-box;
	border-radius: 5px;
	& > legend {
		padding: 0 15px;
		font-size: 1.25rem;
		margin-left: 5px;
	}
`;

const InnerTabs = styled.div<{ childCount: number }>`
	width: 100%;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	& > div {
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		padding-bottom: 5px;
		border: 2px solid gray;
		display: flex;
		justify-content: center;
		width: ${({ childCount }) => 90 / childCount}%;
		align-items: flex-end;
		height: 25px;
		border-bottom: 0;
		color: gray;
		transition: 0.5s;
		&:hover,
		&:active {
			color: white;
			border: 2px solid white;
			border-bottom: 0;
		}
	}
`;

const Tabs = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	cursor: pointer;
	& > div {
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		padding-bottom: 5px;
		border: 2px solid gray;
		width: 14%;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		height: 30px;
		border-bottom: 0;
		color: gray;
		transition: 0.5s;
		&:hover,
		&:active {
			color: white;
			border: 2px solid white;
			border-bottom: 0;
		}
	}
`;

const Container = styled.div`
	box-sizing: border-box;
	border-radius: 10px;
	width: 570px;
	height: 320px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transition: 0.5s;
	margin-bottom: 60px;
`;

export default Response;
