// This will be populated from the CSV
let questions = [];

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const explanationContainer = document.getElementById('explanation-container');
const explanationText = document.getElementById('explanation-text');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const skipButton = document.getElementById('skip-btn');
const progressBar = document.getElementById('progress-bar');

let currentQuestionIndex = 0;
let answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions')) || [];
let dailyQuestions = JSON.parse(localStorage.getItem('dailyQuestions')) || [];
let sessionAnswers = {}; // Track answers for current session {questionID: selectedOption}
let lastUpdateDate = localStorage.getItem('lastUpdateDate') || '';
let currentScore = 0;
let totalQuestions = 0;

// Function to parse CSV data
function parseCSV(text) {
    const parsed = (str => {
        const arr = [];
        let quote = false;
        for (let row = 0, col = 0, c = 0; c < str.length; c++) {
            let cc = str[c], nc = str[c+1];
            arr[row] = arr[row] || [];
            arr[row][col] = arr[row][col] || '';
            if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
            if (cc == '"') { quote = !quote; continue; }
            if (cc == ',' && !quote) { ++col; continue; }
            if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
            if (cc == '\n' && !quote) { ++row; col = 0; continue; }
            if (cc == '\r' && !quote) { ++row; col = 0; continue; }
            arr[row][col] += cc;
        }
        return arr;
    })(text);

    const headers = parsed[0].map(h => h.trim());
    const idIndex = headers.indexOf('ID');
    const questionIndex = headers.indexOf('Question');
    const optionAIndex = headers.indexOf('OptionA');
    const optionBIndex = headers.indexOf('OptionB');
    const optionCIndex = headers.indexOf('OptionC');
    const optionDIndex = headers.indexOf('OptionD');
    const optionEIndex = headers.indexOf('OptionE');
    const answerIndex = headers.indexOf('CorrectAnswer');
    const explanationIndex = headers.indexOf('Explanation');

    return parsed.slice(1)
        .filter(row => row && row[idIndex] && row[idIndex].trim() !== '') // Skip empty rows
        .map(row => {
            const options = [
                row[optionAIndex],
                row[optionBIndex],
                row[optionCIndex],
                row[optionDIndex],
                row[optionEIndex],
            ];

            let correctAnswerText = '';
            const correctLetter = row[answerIndex];
            if (correctLetter === 'A') correctAnswerText = row[optionAIndex];
            else if (correctLetter === 'B') correctAnswerText = row[optionBIndex];
            else if (correctLetter === 'C') correctAnswerText = row[optionCIndex];
            else if (correctLetter === 'D') correctAnswerText = row[optionDIndex];
            else if (correctLetter === 'E') correctAnswerText = row[optionEIndex];

            return {
                ID: parseInt(row[idIndex], 10),
                question: row[questionIndex],
                options: options.filter(o => o && o.trim() !== ''),
                answer: correctAnswerText,
                explanation: row[explanationIndex]
            };
        })
        .filter(q => !isNaN(q.ID) && q.question && q.answer); // Filter out invalid questions
}


// Function to load questions from CSV
async function loadQuestions() {
    try {
        const response = await fetch('ortho_questions.csv');
        const csvText = await response.text();
        questions = parseCSV(csvText);
        console.log(`Total questions parsed: ${questions.length}`);
        console.log('Question IDs:', questions.map(q => q.ID).sort((a,b) => a-b));
        console.log('Questions with NaN ID:', questions.filter(q => isNaN(q.ID)).length);
    } catch (error) {
        console.error('Error loading or parsing CSV file:', error);
        questionText.textContent = 'Failed to load questions. Please check the console for errors.';
    }
}


async function initializeDaily() {
    const today = new Date().toDateString();

    if (lastUpdateDate !== today) {
        // New day - reset daily questions and get 10 new ones
        let availableQuestions = questions.filter(q => !answeredQuestions.includes(q.ID));
        console.log(`Available questions: ${availableQuestions.length}`);

        // If no questions available or fewer than 10, reset progress
        if (availableQuestions.length === 0) {
            console.log('All questions completed! Resetting progress...');
            answeredQuestions = [];
            localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
            availableQuestions = questions; // All questions available again
        }

        // If fewer than 10 questions remain, warn user but continue
        if (availableQuestions.length < 10 && availableQuestions.length > 0) {
            console.log(`Only ${availableQuestions.length} questions remaining before reset`);
        }

        dailyQuestions = shuffleArray(availableQuestions).slice(0, 10).map(q => q.ID);
        console.log('Daily question IDs:', dailyQuestions);

        localStorage.setItem('dailyQuestions', JSON.stringify(dailyQuestions));
        localStorage.setItem('lastUpdateDate', today);
        lastUpdateDate = today;
        currentQuestionIndex = 0;
        currentScore = 0;
        totalQuestions = 0;
    } else {
        console.log('Using existing daily questions:', dailyQuestions);
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getTodaysQuestions() {
    const todaysQs = questions.filter(q => dailyQuestions.includes(q.ID));
    console.log(`Today's questions count: ${todaysQs.length} (expected: ${dailyQuestions.length})`);
    if (todaysQs.length !== dailyQuestions.length) {
        console.warn('Missing questions! Daily IDs:', dailyQuestions);
        console.warn('Found IDs:', todaysQs.map(q => q.ID));
        const missing = dailyQuestions.filter(id => !todaysQs.find(q => q.ID === id));
        console.warn('Missing IDs:', missing);
    }
    return todaysQs;
}

function loadQuestion() {
    const todaysQuestions = getTodaysQuestions();

    if (currentQuestionIndex >= todaysQuestions.length) {
        showCompletion();
        return;
    }

    const currentQuestion = todaysQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    // Count how many questions have been answered (not just viewed)
    const answeredCount = Object.keys(sessionAnswers).length;
    progressBar.textContent = `Question ${currentQuestionIndex + 1}/10 | Score: ${currentScore}/${answeredCount}`;

    // Update button visibility
    prevButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    skipButton.style.display = 'block';
    nextButton.style.display = 'none';

    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
        button.textContent = `${optionLetter}. ${option}`;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
    });

    // Check if this question was already answered in this session
    const previousAnswer = sessionAnswers[currentQuestion.ID];
    if (previousAnswer !== undefined) {
        // Show previous answer
        const buttons = Array.from(optionsContainer.children);
        buttons.forEach(btn => {
            const btnText = btn.textContent.substring(3); // Remove "A. " prefix
            if (btnText === previousAnswer) {
                if (previousAnswer === currentQuestion.answer) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('incorrect');
                }
            }
            if (btnText === currentQuestion.answer) {
                btn.classList.add('correct');
            }
            btn.disabled = true;
        });
        showExplanation(currentQuestion.explanation);
        nextButton.style.display = 'block';
        skipButton.style.display = 'none';
    } else {
        explanationContainer.style.display = 'none';
    }
}

function checkAnswer(selectedOption, button) {
    const todaysQuestions = getTodaysQuestions();
    const currentQuestion = todaysQuestions[currentQuestionIndex];

    // Only count if this question hasn't been answered before
    if (sessionAnswers[currentQuestion.ID] === undefined) {
        totalQuestions++;
        if (selectedOption === currentQuestion.answer) {
            currentScore++;
        }
    }

    // Store the answer in session
    sessionAnswers[currentQuestion.ID] = selectedOption;

    if (selectedOption === currentQuestion.answer) {
        button.classList.add('correct');
    } else {
        button.classList.add('incorrect');
        // Highlight the correct answer
        Array.from(optionsContainer.children).forEach(btn => {
            const btnText = btn.textContent.substring(3); // Remove "A. " prefix
            if (btnText === currentQuestion.answer) {
                btn.classList.add('correct');
            }
        });
    }
    showExplanation(currentQuestion.explanation);
    disableOptions();
    nextButton.style.display = 'block';
    skipButton.style.display = 'none';
}

function showExplanation(explanation) {
    if (explanation && explanation.trim() !== '') {
        explanationText.textContent = explanation;
        explanationText.style.fontStyle = 'normal';
        explanationText.style.color = '#333333';
    } else {
        explanationText.textContent = 'No explanation available for this question.';
        explanationText.style.fontStyle = 'italic';
        explanationText.style.color = '#999';
    }
    explanationContainer.style.display = 'block';
}

function disableOptions() {
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
    });
}

function enableOptions() {
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'incorrect');
    });
}

function nextQuestion() {
    const todaysQuestions = getTodaysQuestions();
    const currentQuestion = todaysQuestions[currentQuestionIndex];

    // Mark question as answered (for tracking across days)
    if (!answeredQuestions.includes(currentQuestion.ID)) {
        answeredQuestions.push(currentQuestion.ID);
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    }

    currentQuestionIndex++;
    enableOptions();
    loadQuestion();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        enableOptions();
        loadQuestion();
    }
}

function skipQuestion() {
    // Skip without answering - just move to next question
    currentQuestionIndex++;
    enableOptions();
    loadQuestion();
}

function showCompletion() {
    const answeredCount = Object.keys(sessionAnswers).length;
    const percentage = answeredCount > 0 ? Math.round((currentScore / answeredCount) * 100) : 0;
    let grade = '';
    let message = '';

    if (percentage >= 90) {
        grade = 'A';
        message = 'Excellent! Outstanding knowledge of orthopedic surgery! 🏆';
    } else if (percentage >= 80) {
        grade = 'B';
        message = 'Great job! Solid understanding of orthopedics! 🎉';
    } else if (percentage >= 70) {
        grade = 'C';
        message = 'Good work! Keep studying to improve! 📚';
    } else if (percentage >= 60) {
        grade = 'D';
        message = 'Fair performance. More review needed. 📖';
    } else {
        grade = 'F';
        message = 'Keep studying! Review the basics. 💪';
    }

    const skippedCount = 10 - answeredCount;
    const skippedMessage = skippedCount > 0
        ? `<p style="color: #ff9800;">⚠️ You skipped ${skippedCount} question${skippedCount !== 1 ? 's' : ''}. Consider reviewing them!</p>`
        : '';

    // Calculate progress stats
    const totalQuestionsInBank = questions.length;
    const questionsAnswered = answeredQuestions.length;
    const questionsRemaining = totalQuestionsInBank - questionsAnswered;
    const progressPercent = Math.round((questionsAnswered / totalQuestionsInBank) * 100);

    let progressMessage = '';
    if (questionsRemaining === 0) {
        progressMessage = '<p style="color: #28a745; font-weight: bold;">🎊 You\'ve completed all questions! Progress will reset tomorrow with fresh questions.</p>';
    } else if (questionsRemaining < 10) {
        progressMessage = `<p style="color: #ff9800;">⚠️ Only ${questionsRemaining} new questions remaining! Progress will automatically reset when complete.</p>`;
    } else {
        progressMessage = `<p style="color: #666;">📊 Progress: ${questionsAnswered}/${totalQuestionsInBank} questions completed (${progressPercent}%)</p>`;
    }

    questionText.innerHTML = `
        <div style="text-align: center;">
            <h2>Quiz Complete! 🎯</h2>
            <div style="font-size: 48px; margin: 20px 0;">${grade}</div>
            <h3>Final Score: ${currentScore}/${answeredCount} (${percentage}%)</h3>
            <p style="font-size: 18px; color: #666;">${message}</p>
            ${skippedMessage}
            ${progressMessage}
            <p style="margin-top: 30px;">Come back tomorrow for 10 new questions!</p>
        </div>
    `;

    optionsContainer.innerHTML = '';
    explanationContainer.style.display = 'none';
    nextButton.style.display = 'none';

    // Add reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset All Progress';
    resetBtn.onclick = () => {
        if (confirm('Reset all progress? This will clear your question history and you can start fresh.')) {
            resetProgress();
        }
    };
    resetBtn.style.cssText = 'margin-top: 20px; background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1em;';
    optionsContainer.appendChild(resetBtn);
}

function resetProgress() {
    localStorage.removeItem('answeredQuestions');
    localStorage.removeItem('dailyQuestions');
    localStorage.removeItem('lastUpdateDate');
    location.reload();
}

nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', previousQuestion);
skipButton.addEventListener('click', skipQuestion);

// Initialize daily questions and load first question
(async () => {
    await loadQuestions();
    await initializeDaily();
    loadQuestion();
})();

// Admin page functionality
if (document.getElementById('clear-storage-btn')) {
    document.getElementById('clear-storage-btn').addEventListener('click', () => {
        localStorage.clear();
        alert('Local storage cleared!');
    });
}

// Debug button on main page
if (document.getElementById('clear-storage-debug')) {
    document.getElementById('clear-storage-debug').addEventListener('click', () => {
        if (confirm('Clear all progress and restart quiz?')) {
            localStorage.clear();
            location.reload();
        }
    });
}
