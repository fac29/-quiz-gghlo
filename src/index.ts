import express, { Express, Application, Request, Response } from 'express';
import fs from 'fs/promises';

const library = 'data.json';

const app: Express = express();
const port = 3210;

// Define the types
interface Question {
    id: number;
    category: string;
    difficulty: string;
    question: string;
    options: string[];
    answer: string;
    favourited: boolean;
    timestamp: string;
}

interface LibraryData {
    questions: Question[];
}

//util section
const readData = async (): Promise<LibraryData> => {
    try {
        const data = await fs.readFile(library, 'utf8');
		console.log(data)
        return JSON.parse(data) as LibraryData;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

//get endpoint setion
app.get('/', (req: Request, res: Response) => {
	readData();
	res.send('Express + TypeScript Server');
});

//get questions by category and difficulty
app.get('/questions', async(req: Request, res: Response) => {
	const data = await readData();
	const questions = data.questions;

	const category = req.query.category
	const difficulty = req.query.difficulty

	let filteredQuestions = questions;

	if (category) {
		filteredQuestions = filteredQuestions.filter((question: any) => question.category === category);
	}

	if (difficulty) {
		filteredQuestions = filteredQuestions.filter((question: any) => question.difficulty === difficulty);
	}

	res.json(filteredQuestions);
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
