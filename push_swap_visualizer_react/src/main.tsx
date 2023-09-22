import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Description from './Description/Description';
import TestPage from './TestPage/TestPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<>
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path={'/'} element={<App />} />
				<Route path={'/description'} element={<Description />} />
				<Route path={'/tester'} element={<TestPage />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	</>
);
