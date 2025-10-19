# Ortho Questions Bot 🦴

A daily orthopedic quiz application with automated question generation, designed for medical students and doctors preparing for orthopedic examinations.

## Features

- 📚 **Daily Quiz System**: 10 randomized questions per day
- 🔄 **Automated Question Generation**: New questions generated daily via AI
- 🎯 **Progress Tracking**: Prevents repeat questions and tracks your learning
- 📊 **Smart Scoring**: Letter grades (A-F) with performance feedback
- 🏥 **7 Clinical Domains**: Comprehensive coverage of orthopedic topics
- ✅ **Detailed Explanations**: Learn from every answer

## Orthopedic Domains Covered

1. **Trauma** - Fracture classifications, management, complications
2. **Spine** - Cervical/thoracic/lumbar pathology, spinal cord injuries
3. **Shoulder and Elbow** - Rotator cuff, instability, nerve injuries
4. **Wrist/Hand** - Carpal fractures, compartment syndrome
5. **Hip and Knee** - Fractures, ligament injuries, pediatric conditions
6. **Foot and Ankle** - Ankle fractures, Achilles pathology, Lisfranc
7. **Orthopedic Emergencies** - Open fractures, compartment syndrome, septic arthritis

## Live Demo

Open [index.html](index.html) in your browser or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## How It Works

### For Users

1. **Daily Questions**: Get 10 new questions every 24 hours
2. **Answer & Learn**: Select your answer, see if you're correct
3. **Read Explanations**: Understand why each answer is right/wrong
4. **Track Progress**: Questions you've answered won't repeat
5. **Score**: Get graded (A-F) based on your performance

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
├── ortho_questions.csv                 # Question database (main)
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

## Question Format

Questions are stored in CSV format:

```csv
ID,Question,OptionA,OptionB,OptionC,OptionD,OptionE,CorrectAnswer,Explanation
1,"A 45-year-old...",Option A,Option B,Option C,Option D,Option E,C,"Explanation..."
```

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
