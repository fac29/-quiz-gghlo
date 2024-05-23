# -quiz-gghlo

# How to use this locally

## Prerequisites

Our project uses Express.JS with Typescript and Node. These are the versions we're running which can be installed with `npm install`:

- Express: 4.17.21
- Node: 20.12.12
- Typescript: 5.4.5

## Installation

Here are instructions for how to install this locally on the repo:

1. Clone the repo

```
git clone https://github.com/fac29/-quiz-gghlo
```

2. Install NPM packages

```
npm install
```

3. Enter the following script to create the `build/index.js` and runs the server.

```
npm start
```

# API Endpoints

These are our endpoints and how we're using them.

| URI            | HTTP Method | POST body   | Result                                                                                                        |
| -------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| /              | GET         | empty       | Show categories of questions and number of questions in those categories (currently returning whole database) |
| /questions     | GET         | JSON string | Submit category and difficulty to filter by                                                                   |
| /questions     | POST        | JSON string | Category, difficulty, questions, options and answer. Timestamp and id are generated automatically             |
| /questions/:id | PUT         | JSON string | Update existing question with favouriting?                                                                    |
| /questions/:id | DELETE      | JSON string | Delete existing question                                                                                      |

# Prettier configuration

We are using Prettier to ensure our codebase is formatted in the same way and avoid conflicts.

To access Prettier settings on VSCode, go to Settings > Search for 'prettier'

The following are settings we've updated from the default:

![Prettier: Jsx Single Quote (ticked) Use single quotes instead of double quotes in JSX.](assets/image.png)

![Prettier: Single Quote (ticked) Use single instead of double quotes](assets/image-1.png)

![Prettier: Use Tabs (ticked) Indent lines with tabs.](assets/image-2.png)

![Editor: Default Formatter Defines a default formatter which takes precedence over all other formatter settings. Must be the identifier of an extension contributing a formatter. Set to 'Prettier - Code formatter'](assets/image-3.png)

# User stories

As a **quizzer**, I want to:

- Select a subject area for my quiz.
- Begin a quiz session with randomly generated questions.
- View a summary of my quiz results, including areas of strength and weakness.
- Add, edit, and delete quiz questions and answers.

- https://drive.google.com/file/d/16tOZ-KAU32farRAmBqDaiYN2LxSPcVan/view?usp=sharing
