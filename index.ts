import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile('public/index.html');
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
