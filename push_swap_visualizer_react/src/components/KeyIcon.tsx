import styled from '@emotion/styled';

const KeyIcon = ({ name, info} : {name :string, info : string}) => {
    return <KeyIconContainer>
        <Icon icon={name} />
        <Info>{info}</Info>
    </KeyIconContainer>
}

const Icon = styled.div<{ icon : string}>`
    background:${({icon})=>`url(${icon}.png)`};
    background-size:100% 100%;
  width:25px;
  height:25px;
  margin-right:10px;
`

const Info = styled.div`
  color:white;
`

const KeyIconContainer = styled.div`
    display:flex;
    align-items:center;
`

export default KeyIcon;

