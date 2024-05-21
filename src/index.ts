import express, { Express, Application, Request, Response } from 'express';

const fs = require('fs');
const library = 'data.json';

const app: Express = express();
const port = 3210;

//util section
const readData = async () => {
	fs.readFile(library, (err: any, data: any) => {
		if (err) {
			console.error(err);
			return;
		}

		console.log(data.toString());
	});
};

// request body template
type Question = {
	id: number;
	category: string;
	difficulty: 'easy' | 'medium' | 'hard';
	question: string;
	options: string[];
	answer: string;
	favourited: boolean;
	timestamp: string;
};

// query params template
type UserInput = {
	difficulty: 'easy' | 'medium' | 'hard';
	category: string;
	numberQus: number;
};

//get endpoint setion
app.get('/', (req: Request, res: Response) => {
	readData();
	res.send('Express + TypeScript Server');
});

app.listen(port, () => {
	console.log('connected to the server is successfull');
});

//section for update endpoints

//section for create new question endpoint

//delete question endpoint section
app.delete('/questions/delete', (req: Request, res: Response) => {
	res.send(`server got a delete request`);
});
