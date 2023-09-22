import styled from "@emotion/styled";
import {useEffect, useRef} from "react";

const CommandSection = ({ list }: { list: string[] })=> {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (!canvas.current) return;
        const ctx = canvas.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0,0,900,50);
        for(let i=0;i<list.length;i++) {
            ctx.fillStyle = i === 2 ? 'white' : i === 1 || i === 3 ? '#cdcdcd' : '#676767'
            ctx.font = '25px Oswald'
            ctx.fillText(list[i], i / list.length * 900 + 90, 30);
        }
    }, [list]);
    return (
        <CommandSectionContainer ref={canvas} width='900px' height='50px'/>
    );
};


const CommandSectionContainer = styled.canvas`
  overflow: hidden;
`;

export default CommandSection;
