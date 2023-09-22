import Deque from "double-ended-queue";
export function createRandomNumber(count: number) {
  const result = [];
  const created = new Array(count + 1).fill(false);

  while (result.length < count) {
    const num = Math.floor(Math.random() * count) + 1;

    if (created[num]) continue;
    result.push(num);
    created[num] = true;
  }
  return result.join(" ");
}

export const colorChange = (
  start: number[],
  end: number[],
  index: number,
  maxIndex: number
) => {
  const r = interpolate(start[0], end[0], index / maxIndex);
  const g = interpolate(start[1], end[1], index / maxIndex);
  const b = interpolate(start[2], end[2], index / maxIndex);
  return `rgb(${r}, ${g}, ${b})`;
};

const interpolate = (start: number, end: number, percent: number) => {
  return start + Math.round((end - start) * percent);
};

export const getStackInfo = (stack: Deque<number>) => {
  if (stack.length < 10) {
    const mid = Math.ceil(stack.length / 2);
    return [
      stack.toArray().slice(mid).reverse(),
      stack.toArray().slice(0, mid).reverse(),
    ];
  } else {
    return [
      stack
        .toArray()
        .slice(stack.length - 5)
        .reverse(),
      stack.toArray().slice(0, 5).reverse(),
    ];
  }
};

export const getAdjacentCommands = (cur: number, commands: string[]) => {
  let temp: string[];
  switch (cur) {
    case 0:
      temp = ["", "", ...commands.slice(0, 3)];
      break;
    case 1:
      temp = ["", ...commands.slice(0, 4)];
      break;
    case commands.length:
      temp = [...commands.slice(commands.length - 2), " ", " ", " "];
      break;
    case commands.length - 1:
      temp = [...commands.slice(commands.length - 3), " ", " "];
      break;
    case commands.length - 2:
      temp = [...commands.slice(commands.length - 4), " "];
      break;
    default:
      temp = [...commands.slice(cur - 2, cur + 3)];
  }
  return temp;
};

export const doReverseOperation = (
  cmd: string,
  left: Deque<number>,
  right: Deque<number>
) => {
  let tmp = -1;
  let tmp1 = -1;
  switch (cmd) {
    case "sa":
      tmp = left.pop() as number;
      tmp1 = left.pop() as number;
      left.push(tmp);
      left.push(tmp1);
      break;
    case "sb":
      tmp = right.pop() as number;
      tmp1 = right.pop() as number;
      right.push(tmp);
      right.push(tmp1);
      break;
    case "ss":
      tmp = left.pop() as number;
      tmp1 = left.pop() as number;
      left.push(tmp);
      left.push(tmp1);
      tmp = right.pop() as number;
      tmp1 = right.pop() as number;
      right.push(tmp);
      right.push(tmp1);
      break;
    case "rra":
      tmp = left.pop() as number;
      left.unshift(tmp);
      break;
    case "rrb":
      tmp = right.pop() as number;
      right.unshift(tmp);
      break;
    case "rrr":
      tmp = left.pop() as number;
      left.unshift(tmp);
      tmp = right.pop() as number;
      right.unshift(tmp);
      break;
    case "ra":
      tmp = left.shift() as number;
      left.push(tmp);
      break;
    case "rb":
      tmp = right.shift() as number;
      right.push(tmp);
      break;
    case "rr":
      tmp = left.shift() as number;
      left.push(tmp);
      tmp = right.shift() as number;
      right.push(tmp);
      break;
    case "pb":
      tmp = right.pop() as number;
      left.push(tmp);
      break;
    case "pa":
      tmp = left.pop() as number;
      right.push(tmp);
      break;
    default:
  }
};
export const doOperation = (
  cmd: string,
  left: Deque<number>,
  right: Deque<number>
) => {
  let tmp = -1;
  let tmp1 = -1;
  switch (cmd) {
    case "sa":
      tmp = left.pop() as number;
      tmp1 = left.pop() as number;
      left.push(tmp);
      left.push(tmp1);
      break;
    case "sb":
      tmp = right.pop() as number;
      tmp1 = right.pop() as number;
      right.push(tmp);
      right.push(tmp1);
      break;
    case "ss":
      tmp = left.pop() as number;
      tmp1 = left.pop() as number;
      left.push(tmp);
      left.push(tmp1);
      tmp = right.pop() as number;
      tmp1 = right.pop() as number;
      right.push(tmp);
      right.push(tmp1);
      break;
    case "ra":
      tmp = left.pop() as number;
      left.unshift(tmp);
      break;
    case "rb":
      tmp = right.pop() as number;
      right.unshift(tmp);
      break;
    case "rr":
      tmp = left.pop() as number;
      left.unshift(tmp);
      tmp = right.pop() as number;
      right.unshift(tmp);
      break;
    case "rra":
      tmp = left.shift() as number;
      left.push(tmp);
      break;
    case "rrb":
      tmp = right.shift() as number;
      right.push(tmp);
      break;
    case "rrr":
      tmp = left.shift() as number;
      left.push(tmp);
      tmp = right.shift() as number;
      right.push(tmp);
      break;
    case "pa":
      tmp = right.pop() as number;
      left.push(tmp);
      break;
    case "pb":
      tmp = left.pop() as number;
      right.push(tmp);
      break;
    default:
  }
};
