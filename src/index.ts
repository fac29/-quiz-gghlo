import express, { Express, Application, Request, Response } from 'express';

const app: Express = express();
const port = 3210;

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.listen(port, () => {
	console.log('connected to the server is successfull');
});
