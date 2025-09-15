const questions = [
    {
        question: "Which bone is commonly fractured in a Colles' fracture?",
        options: ["Tibia", "Fibula", "Radius", "Ulna"],
        answer: "Radius",
        explanation: "A Colles' fracture is a fracture of the distal radius, typically caused by falling on an outstretched hand."
    },
    {
        question: "What is the most common cause of osteomyelitis?",
        options: ["Staphylococcus aureus", "Streptococcus pyogenes", "Escherichia coli", "Pseudomonas aeruginosa"],
        answer: "Staphylococcus aureus",
        explanation: "Staphylococcus aureus is the most common bacterial cause of osteomyelitis, an infection of the bone."
    },
    {
        question: "Which ligament is most commonly injured in an ankle sprain?",
        options: ["Anterior talofibular ligament", "Posterior talofibular ligament", "Deltoid ligament", "Calcaneofibular ligament"],
        answer: "Anterior talofibular ligament",
        explanation: "The anterior talofibular ligament (ATFL) is the most frequently injured ligament in inversion ankle sprains."
    },
    {
        question: "What is the primary function of the menisci in the knee?",
        options: ["Provide stability", "Absorb shock", "Lubricate the joint", "Produce synovial fluid"],
        answer: "Absorb shock",
        explanation: "The menisci are C-shaped cartilages in the knee that primarily function to absorb shock and distribute weight across the joint."
    }
];

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const explanationContainer = document.getElementById('explanation-container');
const explanationText = document.getElementById('explanation-text');
const nextButton = document.getElementById('next-btn');

let currentQuestionIndex = 0;

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
    });
    explanationContainer.style.display = 'none';
    nextButton.style.display = 'none';
}

function checkAnswer(selectedOption, button) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
        button.classList.add('correct');
    } else {
        button.classList.add('incorrect');
        // Optionally highlight the correct answer
        Array.from(optionsContainer.children).forEach(btn => {
            if (btn.textContent === currentQuestion.answer) {
                btn.classList.add('correct');
            }
        });
    }
    showExplanation(currentQuestion.explanation);
    disableOptions();
    nextButton.style.display = 'block';
}

function showExplanation(explanation) {
    explanationText.textContent = explanation;
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
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        enableOptions();
        loadQuestion();
    } else {
        // Quiz finished
        questionText.textContent = "Quiz Finished!";
        optionsContainer.innerHTML = '';
        explanationContainer.style.display = 'none';
        nextButton.style.display = 'none';
    }
}

nextButton.addEventListener('click', nextQuestion);

// Initial load
loadQuestion();