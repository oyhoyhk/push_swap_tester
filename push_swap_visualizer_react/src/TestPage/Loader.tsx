import styled from '@emotion/styled';

const Loader = () => {
	return <Container className="loader" />;
};

const Container = styled.span`
	&.loader,
	&.loader:before,
	&.loader:after {
		border-radius: 50%;
		width: 1.5em;
		height: 1.5em;
		animation-fill-mode: both;
		animation: bblFadInOut 1.8s infinite ease-in-out;
	}
	&.loader {
		display: block;
		color: #fff;
		font-size: 7px;
		position: relative;
		text-indent: -9999em;
		transform: translateZ(0);
		animation-delay: -0.16s;
	}
	&.loader:before,
	&.loader:after {
		content: '';
		position: absolute;
		top: 0;
	}
	&.loader:before {
		left: -2.5em;
		animation-delay: -0.32s;
	}
	&.loader:after {
		left: 2.5em;
	}

	@keyframes bblFadInOut {
		0%,
		80%,
		100% {
			box-shadow: 0 2.5em 0 -1.3em;
		}
		40% {
			box-shadow: 0 2.5em 0 0;
		}
	}
`;

export default Loader;
