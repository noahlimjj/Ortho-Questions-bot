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
let lastDate = localStorage.getItem('lastDate') || '';
let usedQuestionIDs = JSON.parse(localStorage.getItem('usedQuestionIDs')) || [];
let sessionAnswers = {}; // Track answers for current session {questionID: selectedOption}
let currentScore = 0;
let totalQuestions = 0;
const QUESTIONS_PER_DAY = 10;

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
    const imageUrlIndex = headers.indexOf('ImageURL');
    const difficultyIndex = headers.indexOf('Difficulty');

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
                ID: row[idIndex], // Keep as string to support both numeric and Ch#_Q# formats
                question: row[questionIndex],
                options: options.filter(o => o && o.trim() !== ''),
                answer: correctAnswerText,
                explanation: row[explanationIndex],
                imageUrl: row[imageUrlIndex] ? row[imageUrlIndex].trim() : null,
                difficulty: difficultyIndex >= 0 && row[difficultyIndex] ? row[difficultyIndex].trim() : 'Normal'
            };
        })
        .filter(q => q.ID && q.question && q.answer); // Filter out invalid questions
}


// Function to load questions from CSV
async function loadQuestions() {
    try {
        const response = await fetch('ortho_questions.csv');
        const csvText = await response.text();
        questions = parseCSV(csvText);
        console.log(`Total questions parsed: ${questions.length}`);
    } catch (error) {
        console.error('Error loading or parsing CSV file:', error);
        questionText.textContent = 'Failed to load questions. Please check the console for errors.';
    }
}


function getTodaysDate() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

async function initializeDaily() {
    const today = getTodaysDate();

    // Check if it's a new day or first time loading
    if (lastDate !== today || dailyQuestions.length === 0) {
        console.log(`New day detected! Previous: ${lastDate}, Today: ${today}`);

        // Get questions that haven't been used yet
        let availableQuestions = questions.filter(q => !usedQuestionIDs.includes(q.ID));
        console.log(`Available unused questions: ${availableQuestions.length}`);

        // If we've used all questions, reset the pool
        if (availableQuestions.length < QUESTIONS_PER_DAY) {
            console.log('Not enough unused questions! Resetting pool...');
            usedQuestionIDs = [];
            localStorage.setItem('usedQuestionIDs', JSON.stringify(usedQuestionIDs));
            availableQuestions = questions;
        }

        // Select 10 random questions for today
        const shuffled = shuffleArray(availableQuestions);
        const todaysSelection = shuffled.slice(0, QUESTIONS_PER_DAY);
        dailyQuestions = todaysSelection.map(q => q.ID);

        // Add today's questions to the used pool
        usedQuestionIDs.push(...dailyQuestions);

        // Reset progress for the new day
        answeredQuestions = [];
        currentQuestionIndex = 0;

        // Save to localStorage
        localStorage.setItem('dailyQuestions', JSON.stringify(dailyQuestions));
        localStorage.setItem('usedQuestionIDs', JSON.stringify(usedQuestionIDs));
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
        localStorage.setItem('lastDate', today);
        lastDate = today;

        console.log(`Selected ${dailyQuestions.length} questions for today:`, dailyQuestions);
    } else {
        console.log(`Same day (${today}), using existing ${dailyQuestions.length} questions`);
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

function showCompletionMessage() {
    const answeredCount = Object.keys(sessionAnswers).length;
    const percentage = answeredCount > 0 ? Math.round((currentScore / answeredCount) * 100) : 0;

    questionText.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <h2 style="font-size: 2em; margin-bottom: 20px; color: #a78bfa;">🎉 Today's Quiz Complete!</h2>
            <p style="font-size: 1.3em; margin-bottom: 15px;">You've completed all ${QUESTIONS_PER_DAY} questions for today.</p>
            <p style="font-size: 1.5em; font-weight: bold; color: #059669; margin-bottom: 10px;">Score: ${currentScore}/${answeredCount} (${percentage}%)</p>
            <p style="font-size: 1em; color: #6b7280; margin-top: 30px;">Come back tomorrow for ${QUESTIONS_PER_DAY} new questions!</p>
        </div>
    `;

    // Hide image if displayed
    const imageElement = document.getElementById('question-image');
    imageElement.style.display = 'none';

    // Clear options and hide buttons
    optionsContainer.innerHTML = '';
    explanationContainer.style.display = 'none';
    progressBar.textContent = `Final Score: ${currentScore}/${answeredCount} (${percentage}%)`;
    nextButton.style.display = 'none';
    skipButton.style.display = 'none';
    prevButton.style.display = 'none';
}

function loadQuestion() {
    const todaysQuestions = getTodaysQuestions();

    // If we've reached the end of today's questions, show completion message
    if (currentQuestionIndex >= todaysQuestions.length) {
        showCompletionMessage();
        return;
    }

    const currentQuestion = todaysQuestions[currentQuestionIndex];

    // Display question
    questionText.textContent = currentQuestion.question;

    // Handle image display
    const imageElement = document.getElementById('question-image');
    if (currentQuestion.imageUrl && currentQuestion.imageUrl !== '') {
        imageElement.src = currentQuestion.imageUrl;
        imageElement.style.display = 'block';
        imageElement.onerror = () => {
            // Hide image if it fails to load
            imageElement.style.display = 'none';
            console.warn(`Failed to load image: ${currentQuestion.imageUrl}`);
        };
    } else {
        imageElement.style.display = 'none';
    }

    // Count how many questions have been answered (not just viewed)
    const answeredCount = Object.keys(sessionAnswers).length;
    progressBar.textContent = `Question ${currentQuestionIndex + 1}/${todaysQuestions.length} | Score: ${currentScore}/${answeredCount}`;

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

    // Remove feedback button when loading new question
    const existingFeedbackBtn = document.getElementById('feedback-btn');
    if (existingFeedbackBtn) {
        existingFeedbackBtn.remove();
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

    // Add feedback button if not already present
    if (!document.getElementById('feedback-btn')) {
        const feedbackBtn = document.createElement('button');
        feedbackBtn.id = 'feedback-btn';
        feedbackBtn.textContent = '🚩 Report Question';
        feedbackBtn.className = 'feedback-btn';
        feedbackBtn.onclick = () => openFeedbackModal();
        explanationContainer.appendChild(feedbackBtn);
    }
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

    // Only mark if we're not at the end
    if (currentQuestionIndex < todaysQuestions.length) {
        const currentQuestion = todaysQuestions[currentQuestionIndex];

        // Mark question as answered (for tracking)
        if (!answeredQuestions.includes(currentQuestion.ID)) {
            answeredQuestions.push(currentQuestion.ID);
            localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
        }
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

function resetProgress() {
    localStorage.removeItem('answeredQuestions');
    localStorage.removeItem('dailyQuestions');
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

// Feedback system functions
function openFeedbackModal() {
    const todaysQuestions = getTodaysQuestions();
    const currentQuestion = todaysQuestions[currentQuestionIndex];

    // Create modal HTML
    const modalHTML = `
        <div id="feedback-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeFeedbackModal()">&times;</span>
                <h2>Report Issue with Question</h2>
                <p><strong>Question ID:</strong> ${currentQuestion.ID}</p>
                <p><strong>Issue Type:</strong></p>
                <select id="feedback-type" class="feedback-select">
                    <option value="unclear">Question is unclear</option>
                    <option value="wrong-answer">Wrong answer</option>
                    <option value="wrong-explanation">Wrong/unclear explanation</option>
                    <option value="typo">Typo or formatting issue</option>
                    <option value="other">Other issue</option>
                </select>
                <p><strong>Additional Details:</strong></p>
                <textarea id="feedback-details" class="feedback-textarea" placeholder="Please describe the issue..." rows="5"></textarea>
                <div class="modal-buttons">
                    <button onclick="closeFeedbackModal()" class="btn-cancel">Cancel</button>
                    <button onclick="submitFeedback()" class="btn-submit">Submit Feedback</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    const existingModal = document.getElementById('feedback-modal');
    if (existingModal) {
        existingModal.remove();
    }
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.remove();
    }
}

function submitFeedback() {
    const todaysQuestions = getTodaysQuestions();
    const currentQuestion = todaysQuestions[currentQuestionIndex];
    const feedbackType = document.getElementById('feedback-type').value;
    const feedbackDetails = document.getElementById('feedback-details').value.trim();

    if (!feedbackDetails) {
        alert('Please provide some details about the issue.');
        return;
    }

    // Create feedback object
    const feedback = {
        questionID: currentQuestion.ID,
        question: currentQuestion.question,
        issueType: feedbackType,
        details: feedbackDetails,
        timestamp: new Date().toISOString(),
        userAnswer: sessionAnswers[currentQuestion.ID] || 'Not answered',
        correctAnswer: currentQuestion.answer
    };

    // Store feedback in localStorage for now
    let allFeedback = JSON.parse(localStorage.getItem('questionFeedback')) || [];
    allFeedback.push(feedback);
    localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));

    // Show success message
    alert('Thank you for your feedback! Your report has been saved locally. The administrator will review it.');

    // Log feedback to console (for development/testing)
    console.log('Feedback submitted:', feedback);
    console.log('To create GitHub issue, use this data:', JSON.stringify(feedback, null, 2));

    closeFeedbackModal();
}

// Function to export feedback to create GitHub issues
function exportFeedbackForGitHub() {
    const allFeedback = JSON.parse(localStorage.getItem('questionFeedback')) || [];

    if (allFeedback.length === 0) {
        console.log('No feedback to export');
        return;
    }

    console.log('=== FEEDBACK READY FOR GITHUB ISSUES ===');
    allFeedback.forEach((feedback, index) => {
        const issueTitle = `[Question ${feedback.questionID}] ${feedback.issueType}`;
        const issueBody = `
**Question ID:** ${feedback.questionID}
**Issue Type:** ${feedback.issueType}
**Timestamp:** ${feedback.timestamp}

**Question:**
${feedback.question}

**User's Answer:** ${feedback.userAnswer}
**Correct Answer:** ${feedback.correctAnswer}

**Details:**
${feedback.details}

---
*Submitted via Ortho Quiz Feedback System*
        `;

        console.log(`\n--- Issue ${index + 1} ---`);
        console.log('Title:', issueTitle);
        console.log('Body:', issueBody);
    });

    console.log('\n=== END OF FEEDBACK ===');
    console.log(`Total feedback items: ${allFeedback.length}`);
}

// Make functions globally accessible
window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.submitFeedback = submitFeedback;
window.exportFeedbackForGitHub = exportFeedbackForGitHub;
