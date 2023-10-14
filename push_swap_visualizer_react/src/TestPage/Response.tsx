import styled from "@emotion/styled";
import taskList from "../Tasks.json";
import { useEffect, useRef, useState } from "react";
import { TaskInfo } from "./ProcessContainer";

const list: string[] = [];

taskList.tasks.forEach((target) => {
  target.list.forEach((task) => {
    list.push(task.name);
  });
});

const Response = ({
  list,
  selected,
  setSelected,
}: {
  list: Map<string, TaskInfo>;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const conRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);
  const [cur, setCur] = useState(0);
  const [pos, setPos] = useState(0);

  const clickTest = (name: string) => {
    if (!list.get(name)) return;
    const target = list.get(name);

    if (!target || target.state === "pending") return;
    setSelected(name);
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        if (cur === 0) return;
        const width =
          innerRef.current?.children[cur - 1].getBoundingClientRect().width ||
          0;
        setCur(cur - 1);
        setPos(Math.max(0, pos - width - 15));
      } else if (e.deltaY < 0) {
        if (cur === list.size - 1) return;
        const width =
          innerRef.current?.children[cur].getBoundingClientRect().width || 0;
        setCur(cur + 1);
        setPos(Math.min(pos + width + 15, widthRef.current - 570));
      }
    };
    conRef.current?.addEventListener("wheel", onWheel);
    return () => {
      conRef.current?.removeEventListener("wheel", onWheel);
    };
  });

  useEffect(() => {
    if (innerRef.current) {
      let width = 0;
      Array.from(innerRef.current.children).forEach((node) => {
        width += node.getBoundingClientRect().width - 10;
      });
      //  width += innerRef.current.children.length * 15;
      widthRef.current = width;
    }
  }, []);
  return (
    <Container>
      <TestWrapper ref={conRef}>
        <TestList ref={innerRef} pos={pos}>
          {Array.from(list).map(([name, info]) => (
            <div
              onClick={() => clickTest(name)}
              className={info.state}
              key={name}
            >
              {name}
            </div>
          ))}
        </TestList>
      </TestWrapper>
      <ResultArea>
        <legend>Test Result</legend>
        <div>{list.get(selected)?.stdout || "no stdout"}</div>
      </ResultArea>
    </Container>
  );
};

const TestWrapper = styled.div`
  width: 100%;
  height: 50px;
  overflow: hidden;
`;

const TestList = styled.div<{ pos: number }>`
  white-space: nowrap;
  transition: 0.3s;
  box-sizing: border-box;
  ${({ pos }) => `transform : translateX(${-pos}px)`};
  & > div {
    box-sizing: border-box;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    border: 2px solid white;
    margin-right: 15px;
    transition: 0.5s;
    &.pending {
      color: gray;
      border: 2px solid gray;
      cursor: not-allowed;
    }
  }
  & > div:last-of-type {
    margin-right: 0;
  }
`;

const ResultArea = styled.fieldset`
  width: 100%;
  height: 300px;
  border: 2px solid gray;
  box-sizing: border-box;
  margin-top: 25px;
  border-radius: 5px;
  & > legend {
    padding: 0 15px;
    font-size: 1.25rem;
    margin-left: 5px;
  }
`;

const Container = styled.div`
  box-sizing: border-box;
  border-radius: 10px;
  width: 570px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: 0.5s;
  margin-bottom: 60px;
  margin-top: 25px;
`;

export default Response;
