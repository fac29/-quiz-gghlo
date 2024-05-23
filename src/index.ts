import express, { Express, Application, Request, Response } from 'express';

const fs = require('fs');
const fsPromises = fs.promises;
const library = 'data.json';

const app: Express = express();
const port = 3210;

app.use(express.json());

interface LibraryData {
	questions: Question[];
}

// request body template
type Question = {
	id?: number;
	category: string;
	difficulty: 'easy' | 'medium' | 'hard';
	question: string;
	options: [string, string, string, string];
	answer: string;
	favourited?: boolean;
	timestamp?: string;
	numberQus?: number; //number of questions determined by user query but not in library
	completed?: boolean;
};

//util section
const readData = async (): Promise<LibraryData> => {
	try {
		const data = await fsPromises.readFile(library, 'utf8');
		// console.log(data);
		return JSON.parse(data) as LibraryData;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const writeData = async (content: Question) => {
	try {
		// let jsonString = JSON.stringify(content); //do we need this as we don't use it?
		let data = await fsPromises.readFile(library, 'utf8');
		let jsonDB = JSON.parse(data);
		let match = jsonDB.questions.find((item: any) => item.id === content.id);
		if (match) {
			console.log(content);
			const updatedQuestions = jsonDB.questions.map((el: Question) => {
				if (el.id === content.id) {
					return { ...el, ...content };
				}
				return el;
			});

			let updatedJsonString = JSON.stringify(updatedQuestions);
			await fsPromises.writeFile(library, updatedJsonString);
			console.log('The file has been updated!');
		} else {
			// add the new question to the database document
			// id creation
			let dbLength = jsonDB.questions.length;
			content.id = dbLength + 1;
			// timestamp creation
			content.timestamp = new Date().toISOString();
			content.favourited = false;
			jsonDB.questions.push(content);
			let updatedJsonString = JSON.stringify(jsonDB);
			await fsPromises.writeFile(library, updatedJsonString);
			console.log('The file has been saved!');
		}
	} catch (err) {
		console.error(err);
	}

	// console.log();
};

//return user determined number of questions

function returnNumberOfRandomQuestions<Question>(
	questions: Question[],
	n: number
): Question[] {
	// Check if n questions are available
	if (n <= 0 || n > questions.length) {
		throw new Error(
			'The number of questions selected is not available. Select smaller number.'
		);
	}

	// Reorder questions randomly and select the first n elements
	const randomlySelectedQuestions = questions
		.sort(() => 0.5 - Math.random())
		.slice(0, n);

	return randomlySelectedQuestions;
}

//get endpoint setion
app.get('/', (req: Request, res: Response) => {
	readData();
	res.send('Express + TypeScript Server');
});

//get questions by user selected parameters
app.get('/questions', async (req: Request, res: Response) => {
	try {
		const data = await readData();
		const questions = data.questions;
		const category = req.query.category;
		const difficulty = req.query.difficulty;
		const numberOfQuestions = parseInt(
			req.query.questions_number as string,
			10
		);
		let filteredQuestions = questions;

		// filtering questions
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

		if (filteredQuestions.length == 0) {
			res.send('No matching questions found in the library.');
		} else if (numberOfQuestions) {
			/* returning user selected number of questions */
			let selectedQuestions;
			if (numberOfQuestions > filteredQuestions.length) {
				/* return all available questions if less than requested is available */
				selectedQuestions = filteredQuestions;
				res.json(selectedQuestions);
				console.log(
					`${numberOfQuestions} questions were requested, but only ${filteredQuestions.length} questions were found.`
				);
			} else {
				/* return requested number of questions if enough is available */
				selectedQuestions = returnNumberOfRandomQuestions(
					filteredQuestions,
					numberOfQuestions
				);
				res.json(selectedQuestions);
			}
		} else {
			res.json(filteredQuestions);
		}
	} catch (err) {
		res.status(500).send('Failed to read data');
	}
});

app.listen(port, () => {
	console.log('connected to the server is successfull');
});

//section for update endpoints
app.put('/questions', async (req: Request, res: Response) => {
	try {
		const updateQ: Question = req.body;

		await writeData(updateQ);
		res.send('Question successfully updated');
	} catch (err) {
		console.log(err);
	}
});

//section for create new question endpoint
app.post('/questions', async (req: Request, res: Response) => {
	try {
		const newQuestion: Question = req.body;
		console.log({ newQuestion });
		await writeData(newQuestion);
		res.send('Question successfully added');
	} catch (err) {
		console.log(err);
	}
});

//delete question endpoint section
app.delete('/questions/:id', async (req: Request, res: Response) => {
	console.log(parseInt(req.params.id));
	try {
		let id = req.params.id;
		let deleteData = await fsPromises.readFile(library, 'utf8');
		let jsonDeleteData = JSON.parse(deleteData);
		let qMatch = jsonDeleteData.questions.findIndex(
			(item: any) => item.id === id
		);
		if (qMatch) {
			jsonDeleteData.questions.splice(qMatch, 1);
			let updatedJsonString = JSON.stringify(jsonDeleteData);
			await fsPromises.writeFile(library, updatedJsonString);
			console.log('the question has been  deleted');
			res.send('question has successfully been deleted');
		} else {
			console.log(`Question with id ${id} not found`);
		}
	} catch (err) {
		console.log(err);
	}
});
