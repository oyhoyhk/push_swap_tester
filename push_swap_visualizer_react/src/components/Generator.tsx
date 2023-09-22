import styled from "@emotion/styled";
import {createRandomNumber} from "../funcs";
import {useState} from "react";
import Deque from 'double-ended-queue'

const Generator = ({
                       count,
                       handleInputChange,
                       setStack,
                       setOrigin,
                       origin,
                       setCommands
                   }: {
    count: number;
    handleInputChange: React.ChangeEventHandler;
    origin: Deque<number>;
    setStack:  React.Dispatch<React.SetStateAction<Deque<number>>>
    setOrigin:  React.Dispatch<React.SetStateAction<Deque<number>>>
    setCommands: React.Dispatch<React.SetStateAction<string[]>>
}) => {

    const [numberString, setNumberString] = useState('');
    const clickCopyNumbers = () => {
        setStack(new Deque(origin.toArray()));
        navigator.clipboard
            .writeText(numberString)
            .catch((e) => {
                console.error(e);
            });
    };

    const clickCreateNumbers = () => {
        const str = createRandomNumber((count));
        const temp = str.split(' ').map(Number).reverse();
        setNumberString(str);
        setOrigin(new Deque(temp));
        setCommands([]);
        setStack(new Deque(temp));
    }

    return (
        <GeneratorStyled>
            <Container>
                <InputContainer>
                    <label htmlFor="count">Number of Random Numbers : </label>
                    <Input
                        type="text"
                        id="count"
                        value={count}
                        onChange={handleInputChange}
                    />
                </InputContainer>
                <ButtonContainer>
                    <Button onClick={clickCreateNumbers}>Create Random Numbers</Button>
                </ButtonContainer>
            </Container>
            {origin && <Container>
                <NumberContainer>{origin.toArray().slice(0, 10).join(' ')} {origin.length > 10 ? '...' : ''}</NumberContainer>
                <ButtonContainer>
                    <Button onClick={clickCopyNumbers}>Copy in Clipboard</Button>
                </ButtonContainer>
            </Container>}
        </GeneratorStyled>
    );
};

const NumberContainer = styled.div`
  width: 350px;
  height: 50px;
  border-bottom: 3px solid white;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
`

const Button = styled.div`
  border: 3px solid white;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const Container = styled.div`
  display: flex;
  width: 95%;
  justify-content: space-between;
  align-items: center;
  height: 60px;
`;

const InputContainer = styled.div`
  font-size: 1.5rem;
`;

const Input = styled.input`
  background: transparent;
  color: white;
  outline: none;
  border: none;
  font-size: 1.5rem;
  border-bottom: 2px solid white;
  width: 60px;
  text-align: center;
`;

const GeneratorStyled = styled.div`
  width: 580px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 25px auto 25px auto;
`;

export default Generator;
