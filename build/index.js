"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = require('fs');
const fsPromises = fs.promises;
const library = 'data.json';
const app = (0, express_1.default)();
const port = 3210;
app.use(express_1.default.json());
//util section
const readData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fsPromises.readFile(library, 'utf8');
        console.log(data);
        return JSON.parse(data);
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
const writeData = (content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let jsonString = JSON.stringify(content); //do we need this as we don't use it?
        let data = yield fsPromises.readFile(library, 'utf8');
        let jsonDB = JSON.parse(data);
        let match = jsonDB.questions.find((item) => item.id === content.id);
        if (content.id) {
            console.log(content);
            const updatedQuestions = jsonDB.questions.map((el) => {
                if (el.id === content.id) {
                    return Object.assign(Object.assign({}, el), content);
                }
                return el;
            });
            let updatedJsonString = JSON.stringify(updatedQuestions);
            yield fsPromises.writeFile(library, updatedJsonString);
            console.log('The file has been updated!');
        }
        else {
            // add the new question to the database document
            // id creation
            let dbLength = jsonDB.questions.length;
            content.id = dbLength + 1;
            // timestamp creation
            content.timestamp = new Date().toISOString();
            content.favourited = false;
            jsonDB.questions.push(content);
            let updatedJsonString = JSON.stringify(jsonDB);
            yield fsPromises.writeFile(library, updatedJsonString);
            console.log('The file has been saved!');
        }
    }
    catch (err) {
        console.error(err);
    }
    // console.log();
});
//get endpoint setion
app.get('/', (req, res) => {
    readData();
    res.send('Express + TypeScript Server');
});
//get questions by category and difficulty
app.get('/questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield readData();
        const questions = data.questions;
        const category = req.query.category;
        const difficulty = req.query.difficulty;
        let filteredQuestions = questions;
        if (category) {
            filteredQuestions = filteredQuestions.filter((question) => question.category === category);
        }
        if (difficulty) {
            filteredQuestions = filteredQuestions.filter((question) => question.difficulty === difficulty);
        }
        if (filteredQuestions.length > 0) {
            res.json(filteredQuestions);
        }
        else {
            res.send('No matching questions found in the library.');
        }
    }
    catch (err) {
        res.status(500).send('Failed to read data');
    }
}));
app.listen(port, () => {
    console.log('connected to the server is successfull');
});
//section for update endpoints
app.put('/questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateQ = req.body;
        yield writeData(updateQ);
        res.send('Question successfully updated');
    }
    catch (err) {
        console.log(err);
    }
}));
//section for create new question endpoint
app.post('/questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newQuestion = req.body;
        console.log({ newQuestion });
        yield writeData(newQuestion);
        res.send('Question successfully added');
    }
    catch (err) {
        console.log(err);
    }
}));
//delete question endpoint section
app.delete('/questions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(parseInt(req.params.id));
    try {
        let id = req.params.id;
        let deleteData = yield fsPromises.readFile(library, 'utf8');
        let jsonDeleteData = JSON.parse(deleteData);
        let qMatch = jsonDeleteData.questions.findIndex((item) => item.id === id);
        if (qMatch) {
            jsonDeleteData.questions.splice(qMatch, 1);
            let updatedJsonString = JSON.stringify(jsonDeleteData);
            yield fsPromises.writeFile(library, updatedJsonString);
            console.log('the question has been  deleted');
            res.send('question has successfully been deleted');
        }
        else {
            console.log(`Question with id ${id} not found`);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
