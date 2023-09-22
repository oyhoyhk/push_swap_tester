import styled from "@emotion/styled";
import { useEffect, useRef } from "react";

const ProgressBar = ({ pos }: { pos: number }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 900, 5);
    const gradient = ctx.createLinearGradient(0, 0, 900 * pos, 5);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "yellow");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900 * pos, 5);
  });
  return (
    <ProgressBarContainer ref={canvas} pos={pos} width="900px" height="5px" />
  );
};

const ProgressBarContainer = styled.canvas<{ pos: number }>`
  background: #7b7b7b;
`;

export default ProgressBar;
