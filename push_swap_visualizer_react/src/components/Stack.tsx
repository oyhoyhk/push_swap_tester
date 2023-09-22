import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import { colorChange } from "../funcs";
import Deque from "double-ended-queue";

const Stack = ({ stack, count }: { stack: Deque<number>; count: number }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const conRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!canvas.current) return;
    if (stack === undefined) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    const TOTAL_WIDTH = Math.floor(
      canvas.current.getBoundingClientRect().width
    );
    const TOTAL_HEIGHT = Math.floor(
      canvas.current.getBoundingClientRect().height
    );
    const HEIGHT = count > 500 ? 1 : Math.floor(TOTAL_HEIGHT / count);
    if (conRef.current) {
      ctx.clearRect(
        0,
        0,
        conRef.current.getBoundingClientRect().width,
        count > 500 ? count : conRef.current.getBoundingClientRect().height
      );
    }
    ctx.beginPath();
    const start = [255, 0, 0];
    const end = [255, 255, 0];
    for (let i = 0; i < stack.length; i++) {
      const val = stack.get(i) as number;
      const width = Math.round((val / count) * TOTAL_WIDTH * 0.95);
      ctx.fillStyle = colorChange(start, end, val, count);
      ctx.fillRect(0, TOTAL_HEIGHT - HEIGHT * (i + 1), width + 2, HEIGHT);
    }
  }, [canvas, count, stack, conRef]);
  return (
    <StackContainer ref={conRef}>
      <canvas ref={canvas} width={340} height={count > 500 ? count : 530} />
    </StackContainer>
  );
};

const StackContainer = styled.div`
  width: 340px;
  height: 530px;
  & > canvas {
    margin-bottom: 70px;
  }
`;

export default Stack;
