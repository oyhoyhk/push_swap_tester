import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import Deque from "double-ended-queue";
import { getStackInfo } from "../funcs";
const StackInfo = ({
  stack,
  name,
}: {
  stack: Deque<number>;
  name: string;
}) => {
  const [top, bottom] = getStackInfo(stack);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 50, 450);
    ctx.font = "20px Oswald";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    for (let i = 0; i < top.length; i++) {
      ctx.fillText(top[i].toString(), 25, i * 30 + 15);
    }

    for (let i = -1; i < 2; i++) {
      ctx.fillText(".", 25, 225 + 30 * i);
    }

    for (let i = 0; i < bottom.length; i++) {
      ctx.fillText(bottom[i].toString(), 25, 350 + i * 30 - 35);
    }
  }, [stack]);
  return (
    <StackInfoContainer>
      <Canvas ref={canvas} width={50} height={450} />
      <Name>{name}</Name>
    </StackInfoContainer>
  );
};

const Canvas = styled.canvas`
  border-left: 2px solid white;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
`;

const Name = styled.div`
  margin-top: 15px;
  font-size: 0.9rem;
`;

const StackInfoContainer = styled.div`
  width: 50px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  font-size: 1.25rem;
`;

export default StackInfo;
