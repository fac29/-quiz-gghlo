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
const app = (0, express_1.default)();
const port = 3210;
const library = 'data.json';
//util section
const readData = () => __awaiter(void 0, void 0, void 0, function* () {
    fs.readFile(library, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data.toString());
    });
});
//get endpoint setion
app.get('/', (req, res) => {
    readData();
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log('connected to the server is successfull');
});
//delete endpoint section
app.delete('/questions/delete', (req, res) => {
    res.send(`server got a delete request`);
});
