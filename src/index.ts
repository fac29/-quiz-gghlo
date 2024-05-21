import express, { Express, Application, Request, Response } from 'express';
import fs from 'fs/promises';

const library = 'data.json';

const app: Express = express();
const port = 3210;

// Define the types
// interface Question {
//     id: number;
//     category: string;
//     difficulty: string;
//     question: string;
//     options: string[];
//     answer: string;
//     favourited: boolean;
//     timestamp: string;
// }

interface LibraryData {
	questions: Question[];
}

//util section
const readData = async (): Promise<LibraryData> => {
	try {
		const data = await fs.readFile(library, 'utf8');
		console.log(data);
		return JSON.parse(data) as LibraryData;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const writeData = async (content: any) => {
	try {
		let jsonString = JSON.stringify(content);
		let data = await fs.readFile(library, 'utf8');
		let jsonDB = JSON.parse(data);
		let match = jsonDB.find((item: any) => item.id === content.id);
		if (match) {
			let updatedJsonString = JSON.stringify(jsonDB);
			await fs.writeFile(library, updatedJsonString);
			console.log('The file has been updated!');
		} else {
			// add the new question to the database document
			jsonDB.push(content);
			//missing the ID creation
			let updatedJsonString = JSON.stringify(jsonDB);
			await fs.writeFile(library, updatedJsonString);
			console.log('The file has been saved!');
		}
	} catch (err) {
		console.error(err);
	}

	console.log();
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
	numberQus?: number; //number of questions determined by user query but not in library
};

//get endpoint setion
app.get('/', (req: Request, res: Response) => {
	readData();
	res.send('Express + TypeScript Server');
});

//get questions by category and difficulty
app.get('/questions', async (req: Request, res: Response) => {
	try {
		const data = await readData();
		const questions = data.questions;
		const category = req.query.category;
		const difficulty = req.query.difficulty;

		let filteredQuestions = questions;

		if (category) {
			filteredQuestions = filteredQuestions.filter(
				(question: any) => question.category === category
			);
		}

		if (difficulty) {
			filteredQuestions = filteredQuestions.filter(
				(question: any) => question.difficulty === difficulty
			);
		}

		if (filteredQuestions.length > 0) {
			res.json(filteredQuestions);
		} else {
			res.send('No matching questions found in the library.');
		}
	} catch (err) {
		res.status(500).send('Failed to read data');
	}
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
