import styled from "@emotion/styled";
import { useEffect, useRef } from "react";

const Response = ({
  type,
  msg,
}: {
  type: "running" | "success" | "fail";
  msg: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  const cur = useRef<HTMLDivElement>(null);
  const currentMessage = useRef("");

  useEffect(() => {
    console.count("response");
    // prev가 기존 msg, 위로 올라감,
    // cur는 새로운 msg, 아래에서 올라옴
    if (currentMessage.current) {
      // 이전 메시지가 있을 때, prev는 위로 올라가야함
    }
    if (prev.current) {
      prev.current.classList.add("active");
    }
    if (cur.current) {
      cur.current.classList.add("active");
    }
    currentMessage.current = msg;
    return () => {
      if (prev.current) {
        prev.current.textContent = currentMessage.current;
        prev.current.classList.remove("active");
      }
      if (cur.current) {
        cur.current.classList.remove("active");
      }
      const cleanupTimeout = setTimeout(() => {
        // 컴포넌트 언마운트 시 0.5초 후에 실행할 코드
      }, 500); // 0.5초(500밀리초) 지연

      // cleanup 함수에서 clearTimeout을 호출하여 렌더링 취소 시 타임아웃이 클리어되도록 해야합니다.
      return () => clearTimeout(cleanupTimeout);
    };
  }, [msg]);
  return (
    <Container className={type}>
      <PrevMessage ref={prev}>prev</PrevMessage>
      <CurMessage ref={cur}>{msg}</CurMessage>
    </Container>
  );
};

const CurMessage = styled.div`
  position: absolute;
  transition: 0.5s;
  transform: translateY(100px);

  &.active {
    transform: translateY(0);
  }
`;

const PrevMessage = styled.div`
  position: absolute;
  transition: 0.5s;

  &.active {
    transform: translateY(-100px);
  }
`;

const Container = styled.div`
  &.running {
    color: #c1c1c1;
  }
  &.success {
    color: #0bf277;
  }
  &.fail {
    color: #ff6b6b;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  background: red;
`;

export default Response;
