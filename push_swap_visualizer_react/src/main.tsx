import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Description from './Description/Description';
import TestPage from './TestPage/TestPage';
import { RecoilRoot } from 'recoil';
import RankPage from './RankPage/RankPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<>
		<RecoilRoot>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path={'/description'} element={<App />} />
					<Route path={'/'} element={<Description />} />
					<Route path={'/tester'} element={<TestPage />} />
					<Route path={'/rank'} element={<RankPage />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</RecoilRoot>
	</>
);
