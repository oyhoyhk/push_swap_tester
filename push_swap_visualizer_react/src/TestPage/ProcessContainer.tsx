import styled from "@emotion/styled";
import { useCallback, useEffect, useRef, useState } from "react";
import Task from "./Task";
import Response from "./Response";
import taskData from "../Tasks.json";
import axios from "axios";

/*
  Mandetory test 목록
  1. make 잘 되는지, re-link 일어나는지
    * push_swap 프로그램이 잘 생성 되었는지
    * make re
    * make clean
    * make fclean
  2. push_swap 인자 없이 실행 했을 때
  3. 
*/

const SERVER_URL = "http://localhost:8000";

function getAPIs(
  curTestName: string,
  tasks: {
    category: string;
    list: {
      name: string;
      api: string;
      next_api: string;
      status: string;
    }[];
  }[]
) {
  for (let task of tasks) {
    for (let test of task.list) {
      if (test.name === curTestName) return [test.api, test.next_api];
    }
  }
}

function getTestName(
  prevTestList: string[],
  api: string,
  tasks: {
    category: string;
    list: {
      name: string;
      api: string;
      next_api: string;
      status: string;
    }[];
  }[]
) {
  for (let task of tasks) {
    for (let test of task.list) {
      if (test.api === api && !prevTestList.includes(test.name))
        return test.name;
    }
  }
}

export interface ITestInfo {
  name: string;
  api: string;
  next_api: string;
  status: string;
}

const ProcessContainer = ({ id }: { id: string }) => {
  const [tasks, setTasks] = useState(taskData["tasks"]);

  const containerRef = useRef<HTMLFieldSetElement>(null);
  const taskContainerRef = useRef<HTMLDivElement>(null);
  const [currentTest, setCurrentTest] = useState(taskData["start"]);
  const executedTestList = useRef<string[]>([]);

  async function requestTest(curTestName: string) {
    const result = getAPIs(curTestName, tasks);
    if (!result) return;
    const [api, nextAPI] = result;
    executedTestList.current.push(curTestName);
    const nextTest = getTestName(executedTestList.current, nextAPI, tasks);
    if (nextTest === undefined) return;
    setTasks(
      tasks.map((task) => ({
        ...task,
        list: task.list.map((test) => {
          if (test.name === curTestName) {
            return { ...test, status: "running" };
          } else {
            return test;
          }
        }),
      }))
    );
    const response = await axios.get(SERVER_URL + api + id);
    if (response.data) {
      setTasks(
        tasks.map((task) => ({
          ...task,
          list: task.list.map((test) => {
            if (test.name === curTestName) {
              return { ...test, status: "success" };
            } else if (test.name === nextTest) {
              return { ...test, status: "running" };
            } else {
              return test;
            }
          }),
        }))
      );
      setCurrentTest(nextTest);
    } else {
      setTasks(
        tasks.map((task) => ({
          ...task,
          list: task.list.map((test) => {
            if (test.name === curTestName) {
              return { ...test, status: "fail" };
            } else {
              return test;
            }
          }),
        }))
      );
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add("active");
      }
    }, 500);
    setTimeout(() => {
      if (taskContainerRef.current) {
        taskContainerRef.current.classList.add("active");
      }
    }, 1000);
  }, []);

  useEffect(() => {
    requestTest(currentTest);
  }, [currentTest]);
  return (
    <Container ref={containerRef}>
      <legend>Unit Test Process</legend>
      <TaskContainer ref={taskContainerRef}>
        {tasks.map((task, idx) => (
          <Task key={task["category"]} idx={idx} list={task["list"]} />
        ))}
      </TaskContainer>
      {/*<Response {...responseMessage} />*/}
    </Container>
  );
};

const TaskContainer = styled.div`
  width: 90%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  transition: 0.5s;
  transform: translateY(100px);
  &.active {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.fieldset`
  border-radius: 10px;
  width: 570px;
  height: 190px;
  padding: 0;
  margin: 15px auto;
  & > legend {
    padding: 0 15px;
    font-size: 1.5rem;
    margin-left: 20px;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 0;
  transition: 0.5s;
  transform: translateY(100px);
  &.active {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default ProcessContainer;
