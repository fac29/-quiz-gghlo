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
const promises_1 = __importDefault(require("fs/promises"));
const library = 'data.json';
const app = (0, express_1.default)();
const port = 3210;
// Utility function to read data
const readData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile(library, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
//get endpoint setion
app.get('/', (req, res) => {
    readData();
    res.send('Express + TypeScript Server');
});
//get questions by category and difficulty
app.get('/questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.json(filteredQuestions);
    // readData();
    // res.send('Questions');
}));
app.listen(port, () => {
    console.log('connected to the server is successfull');
});
//section for update endpoints
//section for create new question endpoint
//delete question endpoint section
app.delete('/questions/delete', (req, res) => {
    res.send(`server got a delete request`);
});
