# Ortho Questions Bot

This is a simple web-based quiz application for orthopedic questions.

## How it works

The application presents 10 new orthopedic questions to the user each day. The questions are loaded from the `ortho_questions.csv` file. The user's progress is saved in the browser's local storage.

At the end of the quiz, the user is presented with a score and a grade.

## Technologies used

- HTML
- CSS
- JavaScript

## File structure

- `index.html`: The main HTML file.
- `style.css`: The CSS file for styling the application.
- `script.js`: The JavaScript file that contains the application's logic.
- `ortho_questions.csv`: The CSV file that contains the questions.
- `getQuestion.js`: A script to extract questions from a text file.
- `extracted_mcq_questions.txt`: A text file with extracted questions.
- `Ortho questions to import`: A folder with question files.
- `ORTHO SIG QUESTIONS.pdf`: A PDF file with questions.
- `Sports and trauma ortho questions.txt`: A text file with questions.
- `admin.html`: An admin page to clear local storage.

## How to add new questions

To add new questions, you need to edit the `ortho_questions.csv` file. The CSV file has the following columns:

- `ID`: A unique ID for the question.
- `Question`: The question text.
- `OptionA`: The first option.
- `OptionB`: The second option.
- `OptionC`: The third option.
- `OptionD`: The fourth option.
- `CorrectAnswer`: The letter of the correct answer (A, B, C, or D).
- `Explanation`: An explanation for the correct answer.
- `ImageURL`: A URL for an image to be displayed with the question.
