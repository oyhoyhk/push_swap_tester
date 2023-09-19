import express, { Request, Response } from 'express';
import path from 'path';
import { spawn } from 'child_process';

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/repo', (req: Request, res: Response) => {
	const url = req.body['url'];

	const script = spawn('bun', ['public/test_script.ts', url]);

	script.on('exit', (code) => {
		if (code === 0) {
			console.log('script executed successfully');
		} else {
			console.log('script executed failed');
		}
		res.redirect('/');
	});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
