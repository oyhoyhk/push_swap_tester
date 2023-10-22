import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
	const location = useLocation();
	console.log(location.pathname);
	return (
		<HeaderContainer>
			<Title>Push Swap Visualizer</Title>
			<div>
				<StyledLink className={location.pathname === '/' ? 'active' : ''} to={'/description'}>
					Introduce
				</StyledLink>
				<StyledLink className={location.pathname === '/description' ? 'active' : ''} to={'/'}>
					Visualizer
				</StyledLink>
				<StyledLink className={location.pathname === '/tester' ? 'active' : ''} to={'/tester'}>
					Tester
				</StyledLink>
				<StyledLink className={location.pathname === '/rank' ? 'active' : ''} to={'/rank'}>
					Rank
				</StyledLink>
			</div>
		</HeaderContainer>
	);
};

const StyledLink = styled(Link)`
	margin: 5px;
	padding-bottom: 5px;
	border-bottom: 1px solid gray;
	color: gray;
	transition: 0.3s;
	&:hover,
	&.active {
		color: white;
		border-bottom: 1px solid white;
	}
`;

const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 25px auto;
	width: 580px;
`;
const Title = styled.div`
	font-size: 2.5rem;
	text-align: center;
`;
export default Header;
