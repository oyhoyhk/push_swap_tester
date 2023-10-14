import styled from "@emotion/styled";
import { useEffect, useRef } from "react";

const TestList = ({ list }: { list: string[] }) => {
  const onScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("scroll", e);
    console.count("scroll");
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Container className="card">
      <TestInnerWrapper className="card" onScroll={onScroll}>
        {list.map((name) => (
          <div className="card" key={name}>
            {name}
          </div>
        ))}
      </TestInnerWrapper>
    </Container>
  );
};

const TestInnerWrapper = styled.div`
  height: 100%;
  white-space: nowrap;

  /* Firefox에서 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: 0;
  }
  & > div {
    border: 2px solid white;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    margin-right: 15px;
  }
`;

const Container = styled.div`
  width: 570px;
  height: 40px;
  background: red;
`;

export default TestList;
