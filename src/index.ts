import express, { Express, Application, Request, Response } from 'express';

const cors = require('cors');
const https = require('https');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const library = 'data.json';

const app: Express = express();
const appHTTPS: Express = express();
const morgan = require('morgan');
const port = 3210;
const portHTTPS = 2345;

app.use(
	cors({
		origin: 'https://fac29.github.io/quiz-gghlo-frontend',
	})
);
app.use(express.json());
app.use(morgan('dev'));

const options = {
	key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
};

const server = https.createServer(options, app);

server.listen(portHTTPS, () => {
	console.log(`App listening on https://13.60.83.197:${portHTTPS}`);
});

app.listen(port, () => {
	console.log(
		'Successfully connected to the server. Running at: http://localhost:3210/'
	);
});

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

			let updatedJsonString = JSON.stringify(updatedQuestions, null, ' ');
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
			let updatedJsonString = JSON.stringify(jsonDB, null, ' ');
			await fsPromises.writeFile(library, updatedJsonString);
			console.log('The file has been saved!');
		}
	} catch (err) {
		console.error(err);
	}

	// console.log();
};

// converts boolean strings to booleans
function parseBoolean(string: any) {
	return string === 'true' ? true : string === 'false' ? false : undefined;
}

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
app.get('/', async (req: Request, res: Response) => {
	const data = await readData();
	res.json(data);
});

//get questions by user selected parameters
app.get('/questions', async (req: Request, res: Response) => {
	try {
		const data = await readData();
		const questions = data.questions;
		const category = req.query.category;
		const difficulty = req.query.difficulty;
		const favourite = parseBoolean(req.query.favourite);
		const numberOfQuestions = parseInt(
			req.query.questions_number as string,
			10
		);
		let filteredQuestions = questions;

		// filtering questions
		if (favourite) {
			filteredQuestions = filteredQuestions.filter(
				(question: any) => question.favourited === true
			);
		}

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
			res.send({ message: 'No matching questions found in the library.' });
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
		res.status(500).send({ message: 'Failed to read data' });
	}
});

//section for update endpoints
app.put('/questions/:id', async (req: Request, res: Response) => {
	let id = req.params.id;
	let deleteData = await fsPromises.readFile(library, 'utf8');
	let jsonDeleteData = JSON.parse(deleteData);
	let qMatch = jsonDeleteData.questions.findIndex(
		(item: any) => item.id === id
	);

	if (qMatch) {
		try {
			const updateQ: Question = req.body;

			await writeData(updateQ);
			res.send({ message: 'Question successfully updated' });
		} catch (err) {
			console.log(err);
		}
	} else {
		console.log('please enter the correct id');
	}
});

//section for create new question endpoint
app.post('/questions', async (req: Request, res: Response) => {
	try {
		const newQuestion: Question = req.body;
		await writeData(newQuestion);
		res.send({ message: 'Question successfully added' });
	} catch (err) {
		console.log(err);
	}
});

//delete question endpoint section
app.delete('/questions/:id', async (req: Request, res: Response) => {
	let id = req.params.id;
	let deleteData = await fsPromises.readFile(library, 'utf8');
	let jsonDeleteData = JSON.parse(deleteData);
	let questionYass = jsonDeleteData.questions.filter(
		(question: Question) => question.id === parseInt(id)
	);
	if (questionYass.length > 0) {
		try {
			let qMatch = jsonDeleteData.questions.filter(
				(question: any) => question.id !== parseInt(id)
			);
			let updatedJsonString = JSON.stringify({ questions: qMatch }, null, ' ');
			await fsPromises.writeFile(library, updatedJsonString);
			console.log('the question has been  deleted');
			res.send({ message: 'question has successfully been deleted' });
		} catch (err) {
			console.log(err);
		}
	} else {
		console.log('please revise question id');
		res.send({ message: 'please revise question id' });
	}
});

//override the intial values of favourited to false. append this to the element. Create a completed to false add this to the json object.
app.put('/reset', async (req: Request, res: Response) => {
	try {
		let reWriteData = await fsPromises.readFile(library, 'utf8');
		let jsonReWriteData = JSON.parse(reWriteData);

		// Loop through each question and reset properties

		let parsedJsonReWriteData = jsonReWriteData.questions.map(
			(question: any) => ({
				...question,
				favourited: false,
				completed: false,
			})
		);

		// Rewrite database with updated data
		let addingFalse = JSON.stringify(
			{ questions: parsedJsonReWriteData },
			null,
			2
		); // Assuming "questions" is the key for your array of questions
		await fsPromises.writeFile(library, addingFalse);

		res.send({ message: 'Favourite has been reset & Completed been reset' });
	} catch (error) {
		console.error('Error occurred while resetting favourite:', error);
		res
			.status(500)
			.send({ message: 'Error occurred while attempting to reset favourite' });
	}
});
