const questions = [
    {
        ID: 1,
        question: "What is the most common mechanism of anterior cruciate ligament (ACL) injury?",
        options: ["Contact injury with valgus stress", "Non-contact pivoting injury", "Hyperextension injury", "Direct blow to the knee"],
        answer: "Non-contact pivoting injury",
        explanation: "Most ACL injuries (70-80%) occur through non-contact mechanisms, typically during pivoting, cutting, or landing maneuvers when the knee is in slight flexion with valgus and external rotation forces.",
        ImageURL: "https://example.com/acl_injury.jpg"
    },
    {
        ID: 2,
        question: "Which classification system is most commonly used for hip fractures?",
        options: ["Garden classification", "AO classification", "Lauge-Hansen classification", "Salter-Harris classification"],
        answer: "Garden classification",
        explanation: "The Garden classification is the most widely used system for femoral neck fractures, categorizing them into 4 types based on displacement and angulation on AP radiographs.",
        ImageURL: "https://example.com/hip_fracture_classification.jpg"
    },
    {
        ID: 3,
        question: "The 'unhappy triad' of the knee consists of tears to which three structures?",
        options: ["ACL, MCL, medial meniscus", "ACL, PCL, LCL", "PCL, MCL, lateral meniscus", "ACL, LCL, lateral meniscus"],
        answer: "ACL, MCL, medial meniscus",
        explanation: "The unhappy triad (O'Donoghue triad) consists of tears to the anterior cruciate ligament (ACL), medial collateral ligament (MCL), and medial meniscus, typically occurring with valgus and external rotation forces.",
        ImageURL: "https://example.com/unhappy_triad.jpg"
    },
    {
        ID: 4,
        question: "What is the gold standard treatment for displaced femoral neck fractures in elderly patients?",
        options: ["Open reduction and internal fixation", "Total hip arthroplasty", "Hemiarthroplasty", "Conservative management"],
        answer: "Total hip arthroplasty",
        explanation: "Total hip arthroplasty is generally preferred for displaced femoral neck fractures in elderly patients due to lower reoperation rates and better functional outcomes compared to internal fixation.",
        ImageURL: "https://example.com/hip_arthroplasty.jpg"
    },
    {
        ID: 5,
        question: "Which nerve is most commonly injured in humeral shaft fractures?",
        options: ["Median nerve", "Ulnar nerve", "Radial nerve", "Axillary nerve"],
        answer: "Radial nerve",
        explanation: "The radial nerve is most commonly injured in humeral shaft fractures due to its intimate relationship with the spiral groove (radial groove) on the posterior aspect of the mid-shaft humerus.",
        ImageURL: "https://example.com/humeral_shaft_fracture.jpg"
    },
    {
        ID: 6,
        question: "The primary stabilizer of the shoulder against anterior dislocation is:",
        options: ["Rotator cuff", "Labrum", "Biceps tendon", "Capsule"],
        answer: "Labrum",
        explanation: "The labrum, particularly the anterior-inferior labrum and associated ligaments (Bankart lesion area), serves as the primary static stabilizer against anterior shoulder dislocation.",
        ImageURL: "https://example.com/shoulder_stabilizer.jpg"
    },
    {
        ID: 7,
        question: "Which bone is most commonly fractured in the wrist?",
        options: ["Radius", "Ulna", "Scaphoid", "Lunate"],
        answer: "Scaphoid",
        explanation: "The scaphoid is the most commonly fractured carpal bone, typically occurring after a fall on an outstretched hand (FOOSH injury) with the wrist extended and radially deviated.",
        ImageURL: "https://example.com/scaphoid_fracture.jpg"
    },
    {
        ID: 8,
        question: "The 'Ottawa Ankle Rules' are used to:",
        options: ["Determine surgical indication", "Assess fracture stability", "Guide radiographic imaging", "Predict healing time"],
        answer: "Guide radiographic imaging",
        explanation: "The Ottawa Ankle Rules are clinical decision rules used to determine when ankle radiographs are necessary, helping to reduce unnecessary X-rays while maintaining diagnostic accuracy.",
        ImageURL: "https://example.com/ottawa_ankle_rules.jpg"
    },
    {
        ID: 9,
        question: "What is the most common complication of scaphoid fractures?",
        options: ["Infection", "Nonunion", "Nerve injury", "Compartment syndrome"],
        answer: "Nonunion",
        explanation: "Nonunion is the most common complication of scaphoid fractures due to the bone's retrograde blood supply, particularly affecting the proximal pole which has limited vascular supply.",
        ImageURL: "https://example.com/scaphoid_nonunion.jpg"
    },
    {
        ID: 10,
        question: "The 'terrible triad' of the elbow includes:",
        options: ["Radial head fracture, coronoid fracture, posterior dislocation", "Olecranon fracture, radial head fracture, coronoid fracture", "Medial epicondyle fracture, lateral condyle fracture, posterior dislocation", "Radial head fracture, ulnar fracture, anterior dislocation"],
        answer: "Radial head fracture, coronoid fracture, posterior dislocation",
        explanation: "The terrible triad consists of radial head fracture, coronoid process fracture, and posterior elbow dislocation, representing a complex injury pattern with high risk of instability and complications.",
        ImageURL: "https://example.com/terrible_triad.jpg"
    },
    {
        ID: 11,
        question: "Which imaging modality is best for diagnosing rotator cuff tears?",
        options: ["X-ray", "CT scan", "MRI", "Ultrasound"],
        answer: "MRI",
        explanation: "MRI is the gold standard for diagnosing rotator cuff tears, providing excellent soft tissue contrast and ability to assess tear size, location, and quality of remaining tendon tissue.",
        ImageURL: "https://example.com/rotator_cuff_mri.jpg"
    },
    {
        ID: 12,
        question: "The 'drop arm test' is used to assess:",
        options: ["Biceps tendon rupture", "Supraspinatus tear", "Subscapularis tear", "Infraspinatus tear"],
        answer: "Supraspinatus tear",
        explanation: "The drop arm test specifically evaluates supraspinatus function. A positive test (inability to slowly lower the arm from 90° abduction) suggests a significant supraspinatus tear.",
        ImageURL: "https://example.com/drop_arm_test.jpg"
    },
    {
        ID: 13,
        question: "What is the primary indication for immediate surgery in ankle fractures?",
        options: ["Displaced fracture", "Open fracture", "Syndesmotic injury", "Weber C fracture"],
        answer: "Open fracture",
        explanation: "Open fractures require immediate surgical intervention for irrigation, debridement, and stabilization to prevent infection and optimize healing outcomes.",
        ImageURL: "https://example.com/open_ankle_fracture.jpg"
    },
    {
        ID: 14,
        question: "The 'Hawkins sign' in talus fractures indicates:",
        options: ["Avascular necrosis", "Good blood supply", "Malunion", "Infection"],
        answer: "Good blood supply",
        explanation: "A positive Hawkins sign (subchondral radiolucency seen 6-8 weeks post-injury) indicates maintained blood supply to the talar dome and suggests a lower risk of avascular necrosis.",
        ImageURL: "https://example.com/hawkins_sign.jpg"
    },
    {
        ID: 15,
        question: "Which structure is most commonly injured in posterior shoulder dislocations?",
        options: ["Bankart lesion", "Hill-Sachs lesion", "Reverse Hill-Sachs lesion", "SLAP tear"],
        answer: "Reverse Hill-Sachs lesion",
        explanation: "Posterior shoulder dislocations commonly cause a reverse Hill-Sachs lesion (anteromedial humeral head impaction fracture) due to impaction against the posterior glenoid rim.",
        ImageURL: "https://example.com/reverse_hill_sachs.jpg"
    },
    {
        ID: 16,
        question: "What is the most common type of shoulder dislocation?",
        options: ["Anterior", "Posterior", "Inferior", "Superior"],
        answer: "Anterior",
        explanation: "Anterior shoulder dislocations account for over 95% of all shoulder dislocations.",
        ImageURL: "https://example.com/shoulder_dislocation.jpg"
    },
    {
        ID: 17,
        question: "Which nerve is at risk during surgery for carpal tunnel syndrome?",
        options: ["Radial nerve", "Ulnar nerve", "Median nerve", "Axillary nerve"],
        answer: "Median nerve",
        explanation: "Carpal tunnel syndrome involves compression of the median nerve, and it is the nerve at risk during surgical decompression.",
        ImageURL: "https://example.com/carpal_tunnel_nerve.jpg"
    },
    {
        ID: 18,
        question: "What is the primary goal of treatment for a slipped capital femoral epiphysis (SCFE)?",
        options: ["Reduce the slip", "Prevent further slip", "Restore hip range of motion", "Alleviate pain"],
        answer: "Prevent further slip",
        explanation: "The primary goal of SCFE treatment is to prevent further slippage of the femoral epiphysis, typically achieved through in situ pinning.",
        ImageURL: "https://example.com/scfe_hip.jpg"
    },
    {
        ID: 19,
        question: "Which of the following is a common finding in osteoarthritis?",
        options: ["Synovial hypertrophy", "Cartilage loss", "Pannus formation", "Elevated inflammatory markers"],
        answer: "Cartilage loss",
        explanation: "Osteoarthritis is characterized by progressive loss of articular cartilage, leading to joint pain and dysfunction.",
        ImageURL: "https://example.com/osteoarthritis_cartilage.jpg"
    },
    {
        ID: 20,
        question: "What is the most common cause of low back pain?",
        options: ["Herniated disc", "Spinal stenosis", "Muscle strain/ligament sprain", "Spondylolisthesis"],
        answer: "Muscle strain/ligament sprain",
        explanation: "Non-specific low back pain, often due to muscle strains or ligament sprains, is the most common cause of low back pain.",
        ImageURL: "https://example.com/low_back_pain.jpg"
    }
];

const questionText = document.getElementById('question-text');
const questionImage = document.getElementById('question-image');
const optionsContainer = document.getElementById('options-container');
const explanationContainer = document.getElementById('explanation-container');
const explanationText = document.getElementById('explanation-text');
const nextButton = document.getElementById('next-btn');

let currentQuestionIndex = 0;
let answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions')) || [];
let dailyQuestions = JSON.parse(localStorage.getItem('dailyQuestions')) || [];
let lastUpdateDate = localStorage.getItem('lastUpdateDate') || '';

async function fetchDailyQuestions() {
    try {
        const excludeIds = answeredQuestions.join(',');
        const response = await fetch(`/.netlify/functions/getQuestion?count=5&exclude=${excludeIds}`);
        const data = await response.json();

        if (data.message === 'No more questions available') {
            return [];
        }

        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

async function initializeDaily() {
    const today = new Date().toDateString();

    if (lastUpdateDate !== today) {
        // Try to fetch from API first, fallback to local questions
        let newQuestions = await fetchDailyQuestions();

        if (newQuestions.length === 0) {
            // Fallback to local questions
            const availableQuestions = questions.filter(q => !answeredQuestions.includes(q.ID));
            newQuestions = shuffleArray(availableQuestions).slice(0, 5);
        }

        dailyQuestions = newQuestions.map(q => q.ID);

        localStorage.setItem('dailyQuestions', JSON.stringify(dailyQuestions));
        localStorage.setItem('lastUpdateDate', today);
        lastUpdateDate = today;
        currentQuestionIndex = 0;
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
    return questions.filter(q => dailyQuestions.includes(q.ID));
}

function loadQuestion() {
    const todaysQuestions = getTodaysQuestions();

    if (currentQuestionIndex >= todaysQuestions.length) {
        showCompletion();
        return;
    }

    const currentQuestion = todaysQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    
    if (currentQuestion.ImageURL) {
        questionImage.src = currentQuestion.ImageURL;
        questionImage.style.display = 'block';
    } else {
        questionImage.style.display = 'none';
    }

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
    const todaysQuestions = getTodaysQuestions();
    const currentQuestion = todaysQuestions[currentQuestionIndex];
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
    const todaysQuestions = getTodaysQuestions();
    const currentQuestion = todaysQuestions[currentQuestionIndex];

    // Mark question as answered
    if (!answeredQuestions.includes(currentQuestion.ID)) {
        answeredQuestions.push(currentQuestion.ID);
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    }

    currentQuestionIndex++;
    enableOptions();
    loadQuestion();
}

function showCompletion() {
    const completedToday = answeredQuestions.filter(id => dailyQuestions.includes(id)).length;
    const totalAvailable = questions.filter(q => !answeredQuestions.includes(q.ID)).length;

    questionText.innerHTML = `
        <h2>Today's Quiz Complete! 🎉</h2>
        <p>Questions completed today: ${completedToday}/5</p>
        <p>Total questions available: ${totalAvailable}</p>
        <p>Come back tomorrow for 5 new questions!</p>
    `;
    questionImage.style.display = 'none';
    optionsContainer.innerHTML = '';
    explanationContainer.style.display = 'none';
    nextButton.style.display = 'none';

    // Add reset button if user wants to restart
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Progress';
    resetBtn.onclick = resetProgress;
    resetBtn.style.marginTop = '20px';
    resetBtn.className = 'option-btn';
    optionsContainer.appendChild(resetBtn);
}

function resetProgress() {
    localStorage.removeItem('answeredQuestions');
    localStorage.removeItem('dailyQuestions');
    localStorage.removeItem('lastUpdateDate');
    location.reload();
}

nextButton.addEventListener('click', nextQuestion);

// Initialize daily questions and load first question
(async () => {
    await initializeDaily();
    loadQuestion();
})();