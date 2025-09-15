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
    },
    {
        ID: 21,
        question: "What is the order of the normal healing process of bones?",
        options: ["Hematoma, soft callus, hard callus, woven bone, lamellar bone", "soft callus, hard callus, lamellar bone, woven bone", "Hematoma, soft callus, lamellar bone, hard callus, woven bone", "Soft callus, hematoma, hard callus, lamellar bone, woven bone"],
        answer: "Hematoma, soft callus, hard callus, woven bone, lamellar bone",
        explanation: "The normal healing process of bones involves several stages: hematoma formation, soft callus formation, hard callus formation, and finally bone remodeling into lamellar bone.",
        ImageURL: "https://example.com/bone_healing.jpg"
    },
    {
        ID: 22,
        question: "A 47 year old woman, who had just finished her surgical fixation for a complex distal radial fracture of the right arm 12 hours ago, complains of severe forearm pain in the PACU. The anesthetist suspects that the increasing pain is caused by an incomplete nerve block and hence she performs another nerve block with ropivacaine. However, the patient was still screaming due to severe pain and hence the anesthetist came to you. Being Dr. Ooguway, the Master of Medicine, what would be the least appropriate next step in this case?",
        options: ["Check if there is any tingling or pin prick sensation over the area", "Check for pale skin tone over the area", "Use a needle manometer", "Passively extend the muscles and see whether there is increase in pain"],
        answer: "Use a needle manometer",
        explanation: "This is commonly used for unconscious/obtunded patients in clinical practice because you can’t elicit pain history from them. However, if the patient complains of excruciating pain and if in the right clinical context, emergency management for compartment syndrome can be performed. Check for 5 ‘P’s if suspect compartment syndrome – Pain, Paresthesia, pressure, pallor, pulselessness.",
        ImageURL: "https://example.com/compartment_syndrome.jpg"
    },
    {
        ID: 23,
        question: "Which one of the following is false about the clinical examinations of an ACL tear?",
        options: ["Posterior drawer is negative", "Anterior drawer is positive", "There is posterior sag of the knee", "Lachman test is positive"],
        answer: "There is posterior sag of the knee",
        explanation: "Posterior sag and drawer are positive for PCL tear.",
        ImageURL: "https://example.com/acl_exam.jpg"
    }
];

const questionText = document.getElementById('question-text');
const questionImage = document.getElementById('question-image');
const optionsContainer = document.getElementById('options-container');
const explanationContainer = document.getElementById('explanation-container');
const explanationText = document.getElementById('explanation-text');
const nextButton = document.getElementById('next-btn');

let currentQuestionIndex = 0;

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
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
        questionImage.style.display = 'none';
        optionsContainer.innerHTML = '';
        explanationContainer.style.display = 'none';
        nextButton.style.display = 'none
    }
}

nextButton.addEventListener('click', nextQuestion);

// Initial load
loadQuestion();