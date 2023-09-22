import styled from '@emotion/styled'

const Introduction = () => {
    return <IntroductionContainer>
        <legend>Introduction</legend>
        <Info>
            1. Create Random Numbers
        </Info>
        <Info>
            2. Copy in your Clipboard
        </Info>
        <Info>
            3. Save result of your push_swap in file
        </Info>
        <Info>
            4. Put your "result" in this page
        </Info>
    </IntroductionContainer>
}

const Info = styled.div`
  width: 80%;
  margin: 25px auto;
  font-size: 1.5rem;
`


const IntroductionContainer = styled.fieldset`
  border-radius: 10px;
  width: 570px;
  padding: 0;
  margin: 15px auto;

  & > hr {
    width: 80%;
  }

  & > img {
    width: 500px;
    display: block;
    margin: 20px auto;
  }

  & > legend {
    padding: 0 15px;
    font-size: 1.5rem;
    margin-left: 20px;
  }
`

export default Introduction;