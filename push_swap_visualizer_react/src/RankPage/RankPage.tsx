import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

async function getData(page: number, paramCount: number) {
	const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rank?page=${page}&param_count=${paramCount}`);
	return response.data;
}

interface IRankInfo {
	unique_id: number;
	answer_count: number;
	id: string;
	param_count: number;
	country: string;
}

type Category = '500' | '100';

type List = { [key in Category]: IRankInfo[] };

const RankPage = () => {
	const conRef = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useState<Category>('500');
	const [list, setList] = useState<List>({ '500': [], '100': [] });

	useEffect(() => {
		conRef.current?.classList.add('active');
		getData(0, 500).then((res: IRankInfo[]) => {
			console.log('res : ', res);
			setList({ ...list, '500': [...res] });
		});
	}, []);

	// https://flagcdn.com/:size/:country_code.png
	return (
		<Container ref={conRef}>
			<div>
				<div>Pararm Counts</div>
				<div>
					<div onClick={() => setCategory('500')} className={category === '500' ? 'active' : ''}>
						500
					</div>
					<div onClick={() => setCategory('100')} className={category === '100' ? 'active' : ''}>
						100
					</div>
				</div>
			</div>
			<RanksContainer>
				<TableHead>
					<div>Rank</div>
					<div>Country</div>
					<div>ID</div>
					<div>Commands Count</div>
				</TableHead>
				<TableBody>
					{list[category].map((rank, idx) => (
						<div>
							<div>{idx + 1}</div>
							<Country country={rank.country} />
							<div>{rank.id}</div>
							<div>{rank.answer_count}</div>
						</div>
					))}
				</TableBody>
			</RanksContainer>
		</Container>
	);
};

const RanksContainer = styled.div`
	width: 95;
	height: 75vh;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
`;

const TableContents = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
`;

const Country = styled.div<{ country: string }>`
	width: 80%;
	height: 80%;
	background: red;
	background: url(${({ country }) => `https://flagcdn.com/w40/${country.toLowerCase()}.png`});
	background-size: 70% 70%;
	background-repeat: no-repeat;
	background-position: center center;
`;

const TableHead = styled(TableContents)`
	margin-top: 25px;
	width: 100%;
	height: 40px;
	& > div {
		display: flex;
		justify-content: center;
		height: 100%;
		align-items: center;
		border-bottom: 2px solid white;
	}
	& > div:nth-of-type(1) {
		width: 10%;
	}
	& > div:nth-of-type(2) {
		width: 10%;
	}
	& > div:nth-of-type(3) {
		width: 30%;
	}
	& > div:nth-of-type(4) {
		width: 30%;
	}
`;

const TableBody = styled(TableContents)`
	flex: 1;
	overflow: auto;
	width: 100%;
	display: block;
	& > div {
		display: flex;
		width: 100%;
		height: 40px;
		margin-top: 10px;
		justify-content: space-between;
		& > div {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			border-bottom: 1px solid gray;
		}
		& > div:nth-of-type(1) {
			width: 10%;
		}
		& > div:nth-of-type(2) {
			width: 10%;
		}
		& > div:nth-of-type(3) {
			width: 30%;
		}
		& > div:nth-of-type(4) {
			width: 30%;
		}
	}

	&::-webkit-scrollbar {
		background: transparent;
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 1rem;
		background: linear-gradient(45deg, #707070, #949494);
	}
`;

const Container = styled.div`
	width: 570px;
	height: 80vh;
	margin: 50px auto;
	opacity: 0;
	transition: 0.5s;
	transform: translateY(50px);
	&.active {
		transform: translateY(0);
		opacity: 1;
	}
	& > div:first-of-type {
		font-size: 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		& > div:first-of-type {
			font-weight: bold;
		}
		& > div:last-of-type {
			display: flex;
			& > div {
				border-bottom: 1px solid gray;
				padding-bottom: 5px;
				transition: 0.5s;
				color: gray;
				cursor: pointer;
				&.active,
				&:hover {
					color: white;
					border-bottom: 1px solid white;
				}
			}
			& > div:first-of-type {
				margin-right: 20px;
			}
		}
	}
`;

export default RankPage;
