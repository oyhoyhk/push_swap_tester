import styled from "@emotion/styled";

const Footer = () => {
  return (
    <FooterContainer>
      <div>
        Developed by{" "}
        <a href="https://github.com/oyhoyhk" target="_blank">
          yooh
        </a>{" "}
        in 42Seoul
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  height: 50px;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  & a {
    text-decoration: underline;
    color: gray;
  }
  & a:visited {
    color: #b9b9b9;
  }
`;

export default Footer;
