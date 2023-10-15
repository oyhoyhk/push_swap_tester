import { ITestInfo } from './TestPage/ProcessContainer';

export interface IModalInfo {
	xPos: number;
	yPos: number;
	category: string;
	testInfo: ITestInfo[];
}
