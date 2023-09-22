import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
	return (
		<HeaderContainer>
			<Title>Push Swap Visualizer</Title>
			<div>
				<StyledLink to={'/description'}>Introduce</StyledLink>
				<StyledLink to={'/'}>Visualizer</StyledLink>
				<StyledLink to={'/tester'}>Tester</StyledLink>
			</div>
		</HeaderContainer>
	);
};

const StyledLink = styled(Link)`
	margin: 5px;
	padding-bottom: 5px;
	border-bottom: 1px solid gray;
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
