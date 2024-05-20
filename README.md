# -quiz-gghlo

# API Endpoints

| URI | HTTP Method | POST body | Result |
| --- | ----------- | --------- | ------ |
|  /  | GET         | empty | Show categories of questions and number of questions in those categories |
| /questions | GET | JSON string | Submit category and difficulty to filter by |
| /questions | POST | JSON string | Category, difficulty, questions, options and answer. Timestamp and id are generated automatically |
| /questions/:id | PUT | JSON string | Update existing question with favouriting? |
| /questions/:id | DELETE | JSON string | Delete existing question |
