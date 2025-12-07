# Ortho Questions Bot 🦴

A daily orthopedic quiz application with automated question generation, designed for medical students and doctors preparing for orthopedic examinations.

## Features

- 📚 **336 Questions**: Comprehensive question bank across 9 specialized categories
- 🏷️ **Category Filtering**: Study specific topics (Hand/Wrist, Shoulder, Spine, etc.)
- 📚 **Daily Quiz System**: 10 randomized questions per day
- 🔄 **Automated Question Generation**: New questions generated daily via AI
- 🎯 **Progress Tracking**: Prevents repeat questions and tracks your learning
- 📊 **Smart Scoring**: Letter grades (A-F) with performance feedback
- ✅ **Detailed Explanations**: Learn from every answer

## Categories Available

The quiz includes **336 questions** across **9 specialized categories**:

1. **Hand and Wrist** (~30 questions) - Scaphoid fractures, carpal tunnel, flexor tendons
2. **Shoulder** (~30 questions) - Rotator cuff, instability, dislocations
3. **Spine** (~30 questions) - Cervical/thoracic/lumbar pathology, spinal cord injuries
4. **Hip and Pelvis** (~30 questions) - Hip fractures, AVN, pelvic ring injuries
5. **Knee** (~30 questions) - ACL/PCL tears, meniscal injuries, fractures
6. **Foot and Ankle** (~30 questions) - Ankle fractures, Achilles, talus injuries
7. **Pathology** (~30 questions) - Bone tumors, infections, metabolic bone disease
8. **Paediatrics** (~30 questions) - SCFE, Perthes, developmental dysplasia
9. **Trauma** (~30 questions) - Polytrauma, open fractures, compartment syndrome

**Plus 66 mixed/uncategorized questions** covering various orthopedic topics.

## Live Demo

Open [index.html](index.html) in your browser or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## How It Works

### For Users

1. **Select Category**: Choose a specific topic or "All Categories" for mixed practice
2. **Daily Questions**: Get 10 new questions every 24 hours
3. **Answer & Learn**: Select your answer, see if you're correct
4. **Read Explanations**: Understand why each answer is right/wrong
5. **Track Progress**: Questions you've answered won't repeat
6. **Score**: Get graded (A-F) based on your performance

### Category Filtering

Study specific topics or get mixed practice:

- **All Categories (Mixed)**: Random questions from all 336 questions
- **Specific Category**: Focus on one topic (e.g., only Hand and Wrist)
- **Uncategorized**: Original 66 questions without category assignment

**How to use:**
1. Select category from dropdown menu at the top
2. Quiz resets with questions from that category
3. Daily questions refresh every 24 hours
4. Progress is tracked separately per category

**Benefits:**
- Targeted study for weak areas
- Comprehensive topic review before exams
- Flexible learning approach

### For Maintainers (Automated System)

The bot automatically generates, reviews, and merges new questions:

- **Frequency**: Daily at 2 AM UTC
- **AI Generation**: Perplexity API (Sonar Pro model)
- **AI Validation**: Claude API (Sonnet 4) reviews each question
- **Auto-Filtering**: Questions scoring ≥9.0/10 are kept, <9.0 removed
- **Auto-Merge**: PRs with passing questions merge automatically
- **Cost**: ~$0.20/month

See [docs/AUTOMATION_SETUP.md](docs/AUTOMATION_SETUP.md) for setup instructions.

## Project Structure

```
├── index.html                          # Main quiz interface
├── script.js                           # Quiz logic and localStorage
├── style.css                           # UI styling
├── admin.html                          # Admin debugging interface
├── ortho_questions.csv                 # Question database (336 questions)
├── Difficult questions/                # Source chapter CSVs (270 questions)
│   ├── MCQ_Chapter2_Complete.csv       # Hand and Wrist
│   ├── MCQ_Chapter3_FULL.csv           # Shoulder
│   ├── MCQ_Chapter4_Complete.csv       # Spine
│   ├── MCQ_Chapter5_Complete.csv       # Hip and Pelvis
│   ├── MCQ_Chapter6_Complete.csv       # Knee
│   ├── MCQ_Chapter7_Complete.csv       # Foot and Ankle
│   ├── MCQ_Chapter8_Complete.csv       # Pathology
│   ├── MCQ_Chapter9_Complete.csv       # Paediatrics
│   └── MCQ_Chapter10_Complete.csv      # Trauma
├── QUESTION_BUILDER_PROMPT.md          # AI prompt template
├── README.md                           # This file
├── package.json                        # Node.js dependencies
├── .github/
│   └── workflows/
│       ├── daily-questions.yml         # Daily question generation
│       └── weekly-review.yml           # Automated PR review
├── scripts/
│   ├── generate-questions.js           # Question generator
│   ├── review-pr.js                    # Automated PR reviewer
│   ├── claude-validator-prompt.md      # Question validation prompt
│   ├── domain-tracker.json             # Domain rotation state
│   ├── validate-csv.js                 # CSV validator
│   └── shuffle-questions.js            # Question randomizer
├── docs/
│   ├── AUTOMATION_SETUP.md             # Setup guide
│   └── gemini.md                       # Alternative AI notes
├── utilities/
│   ├── import_difficult_questions.py   # Import and categorize questions
│   ├── parser.py                       # Text parsing utilities
│   ├── checker.py                      # CSV checker
│   ├── debug_csv.html                  # CSV debugging tool
│   ├── process_screenshots.py          # Screenshot OCR
│   └── reorder_questions.py            # Question reorderer
├── archive/
│   └── fix_csv*.py                     # Old CSV fixing scripts
└── images/                             # Question images
```

## Setup for Development

### Prerequisites

- Node.js 18+
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/noahlimjj/Ortho-Questions-bot.git
cd Ortho-Questions-bot

# Install dependencies
npm install

# Start local server
python3 -m http.server 8000
```

Visit `http://localhost:8000`

### Importing Questions from Chapters

To re-import the 270 questions from chapter CSV files:

```bash
python3 utilities/import_difficult_questions.py
```

This script will:
- Read all 9 chapter CSV files from "Difficult questions" folder
- Map chapters to categories (Ch2→Hand and Wrist, Ch3→Shoulder, etc.)
- Merge with existing questions
- Add Category column
- Output updated ortho_questions.csv with 336 total questions

## Question Format

Questions are stored in CSV format:

```csv
ID,Question,OptionA,OptionB,OptionC,OptionD,OptionE,CorrectAnswer,Explanation,ImageURL,Category
1,"A 45-year-old...",Option A,Option B,Option C,Option D,Option E,C,"Explanation...",,""
Ch2_Q1,"Which of the following...",Option A,Option B,Option C,Option D,Option E,A,"Explanation...",,"Hand and Wrist"
```

**ID Formats:**
- **Numeric IDs (1-66):** Original questions, uncategorized
- **Ch#_Q# format:** Imported chapter questions with categories
  - Ch2 = Hand and Wrist
  - Ch3 = Shoulder
  - Ch4 = Spine, etc.

### Requirements

- **5 options** (A-E) per question
- **Evidence-based** explanations
- **High-yield** content for exams
- **Clinically relevant** scenarios

## Contributing

### Adding Questions Manually

1. Edit `ortho_questions.csv`
2. Follow the format in [QUESTION_BUILDER_PROMPT.md](QUESTION_BUILDER_PROMPT.md)
3. Ensure all 5 options (A-E) are provided
4. Add detailed explanation
5. Commit and push

### Importing from Text Files

See [amboss2csv.md](amboss2csv.md) for importing questions from text format.

### Automated Generation Setup

See [AUTOMATION_SETUP.md](AUTOMATION_SETUP.md) for setting up daily automated question generation.

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: LocalStorage for progress tracking
- **Data**: CSV format for questions
- **Automation**: GitHub Actions + Perplexity API
- **AI Model**: llama-3.1-sonar-large-128k-online

## Automation Details

### Daily Workflow

1. GitHub Actions runs at 2 AM UTC
2. Reads existing questions and domain rotation
3. Calls Perplexity API with context
4. Validates generated questions
5. Creates Pull Request for review
6. Rotates to next domain

### Domain Rotation

Questions are generated in a rotating schedule:

- **Day 1**: Trauma
- **Day 2**: Spine
- **Day 3**: Shoulder and Elbow
- **Day 4**: Wrist/Hand
- **Day 5**: Hip and Knee
- **Day 6**: Foot and Ankle
- **Day 7**: Orthopedic Emergencies
- **Day 8**: Back to Trauma...

This ensures **balanced coverage** across all domains.

## License

MIT License - feel free to use and modify for educational purposes.

## Credits

- Built with [Claude Code](https://claude.com/claude-code)
- Questions generated with [Perplexity AI](https://www.perplexity.ai)
- Designed for orthopedic medical education

## Support

For setup issues or questions:

1. Check [AUTOMATION_SETUP.md](AUTOMATION_SETUP.md)
2. Review GitHub Actions logs
3. Open an issue on GitHub

---

**Made for medical students and doctors preparing for orthopedic examinations** 🏥
