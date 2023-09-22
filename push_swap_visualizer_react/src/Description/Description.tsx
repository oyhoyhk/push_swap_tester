import styled from "@emotion/styled";
import data from "./CommandsInfo.json";
import cmdMapJson from "./CommandMap.json";
import { useEffect, useRef, useState } from "react";

const cmdMap = JSON.parse(cmdMapJson);

interface ICmdInfo {
  name: string;
  description: string;
}

interface IStackInfo {
  list: string[];
  type: string[];
  width: number;
  height: number;
  x: number;
  y: number;
  name: string;
}

function drawStackInfo(
  ctx: CanvasRenderingContext2D,
  list: string[],
  type: string[],
  x: number,
  y: number
) {
  ctx.font = "25px Arial";
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = type[i];
    ctx.fillText(list[i], x + 30, y + i * 35 + 35);
  }
}

function drawStack(
  ctx: CanvasRenderingContext2D,
  arr: IStackInfo[],
  cur: string
) {
  ctx.clearRect(0, 0, 580, 350);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  const textWidth = ctx.measureText(cur).width;
  const canvasWidth = ctx.canvas.width;
  const x = (canvasWidth - textWidth) / 2;
  ctx.fillText(cur, x, 60);
  for (let { width, height, x, y, name, list, type } of arr) {
    drawStackBox(ctx, width, height, x, y, name);
    drawStackInfo(ctx, list, type, x, y);
  }

  drawArrow(ctx);
}

function drawStackBox(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  xPos: number,
  yPos: number,
  name: string
) {
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.moveTo(xPos, yPos);
  ctx.lineTo(xPos, yPos + height);
  ctx.lineTo(xPos + width, yPos + height);
  ctx.lineTo(xPos + width, yPos);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(name, xPos + 5, yPos + height + 30);
}

function drawArrow(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.lineTo(250, 180);
  ctx.lineTo(250, 195);
  ctx.lineTo(275, 195);
  ctx.lineTo(275, 205);
  ctx.lineTo(300, 187.5);
  ctx.lineTo(275, 170);
  ctx.lineTo(275, 180);
  ctx.fillStyle = "white";
  ctx.fill();
}

const solutions = [
  { name: "Greedy Sort", file: "greedy_sort.mov" },
  { name: "Radix Sort", file: "radix_sort.mov" },
  { name: "Merge Sort", file: "merge_sort.mov" },
];

const Description = () => {
  const [cmd, setCmd] = useState("sa");
  const [idx, setIdx] = useState(0);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [upper, setUpper] = useState(false);
  const [below, setBelow] = useState(false);
  const [solIndex, setSolIndex] = useState(0);
  const [curSolution, setCurSolution] = useState("Greedy Sort");

  const onClick = (val: string, index: number) => {
    setCmd(val);
    setIdx(index);
  };

  const onClickSolution = (val: string, index: number) => {
    setCurSolution(val);
    setSolIndex(index);
  };

  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    if (!upper) return;

    drawStack(ctx, cmdMap[cmd].info, data[idx].title);
  }, [upper, cmd, below]);

  return (
    <DescriptionContainer>
      <h2 onClick={() => setUpper(!upper)}>
        <Direction className={upper ? "on" : ""}>{">"}</Direction> What is Push
        Swap?
      </h2>
      {upper && (
        <p>
          "push_swap" is a task to sort an unsorted stack A to stack B using a
          given set of commands while minimizing the number of commands used.
        </p>
      )}
      {upper && (
        <CommandSelector>
          {data.map((info: ICmdInfo, index: number) => (
            <div
              key={info.name}
              className={cmd === info.name ? "active" : ""}
              onClick={() => onClick(info.name, index)}
            >
              {info.name}
            </div>
          ))}
        </CommandSelector>
      )}
      {upper && <Canvas id="stack" width="580" height="350" ref={canvas} />}
      {upper && (
        <DescriptionContainer>
          <p>{data[idx].description}</p>
        </DescriptionContainer>
      )}

      <h2 onClick={() => setBelow(!below)}>
        <Direction className={below ? "on" : ""}>{">"}</Direction> How can I
        solve it?
      </h2>
      {below && (
        <CommandSelector>
          {solutions.map((obj: any, idx) => (
            <div
              className={curSolution === solutions[idx].name ? "active" : ""}
              key={obj.name}
              onClick={() => onClickSolution(obj.name, idx)}
            >
              {obj.name}
            </div>
          ))}
        </CommandSelector>
      )}
      {below && (
        <video
          controls={true}
          src={"./" + solutions[solIndex].file}
          width={"100%"}
          height={"600px"}
        />
      )}
    </DescriptionContainer>
  );
};

const Direction = styled.div`
  display: inline-block;
  margin-right: 15px;
  &.on {
    transform: rotateZ(90deg);
  }
`;

const Canvas = styled.canvas`
  margin-top: 25px;
`;

const CommandSelector = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 1.5rem;
  color: gray;
  cursor: pointer;
  & > div {
    height: 100%;
  }
  & .active {
    color: white;
  }
`;

const DescriptionContainer = styled.div`
  width: 580px;
  margin: 25px auto;

  & > p {
    padding: 0 20px;
    font-size: 1.5rem;
    height: 90px;
  }

  h2 {
    cursor: pointer;
    margin-bottom: 50px;
  }
`;
export default Description;
