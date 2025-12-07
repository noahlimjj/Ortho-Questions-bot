# Task: Update README.md with Category Filtering Feature

## Context
We've successfully:
1. Imported 240+ questions from "Difficult questions" folder
2. Added Category column to CSV (9 categories total)
3. Implemented category filtering UI
4. Total questions now: **336 questions** (66 original + 270 new)

## File to Update
`README.md` at `/Users/User/Desktop/Projects/Ortho Questions bot/README.md`

## Changes Required

### 1. Update Features Section (around line 5-12)

Add a new feature after "Daily Quiz System":
```markdown
- 📚 **336 Questions**: Comprehensive question bank across 9 categories
- 🏷️ **Category Filtering**: Study specific topics (Hand/Wrist, Shoulder, Spine, etc.)
- 📚 **Daily Quiz System**: 10 randomized questions per day
```

### 2. Update Orthopedic Domains Covered (around line 14-22)

Replace the entire section with:
```markdown
## Categories Available

The quiz includes **336 questions** across **9 specialized categories**:

1. **Hand and Wrist** (~30 questions) - Scaphoid fractures, carpal tunnel, flexor tendons
2. **Shoulder** (~30 questions) - Rotator cuff, instability, dislocations
3. **Spine** (~30 questions) - Cervical/thoracic/lumbar pathology, spinal cord injuries
4. **Hip and Pelvis** (~30 questions) - Hip fractures, AVN, pelvis ring injuries
5. **Knee** (~30 questions) - ACL/PCL tears, meniscal injuries, fractures
6. **Foot and Ankle** (~30 questions) - Ankle fractures, Achilles, talus injuries
7. **Pathology** (~30 questions) - Bone tumors, infections, metabolic bone disease
8. **Paediatrics** (~30 questions) - SCFE, Perthes, developmental dysplasia
9. **Trauma** (~30 questions) - Polytrauma, open fractures, compartment syndrome

**Plus 66 mixed/uncategorized questions** covering various orthopedic topics.
```

### 3. Add Category Filtering Section (after "How It Works", around line 56)

Add a new section:
```markdown
## Category Filtering

Study specific topics or get mixed practice:

- **All Categories (Mixed)**: Random questions from all 336 questions
- **Specific Category**: Focus on one topic (e.g., only Hand and Wrist)
- **Uncategorized**: Original 66 questions without category assignment

**How to use:**
1. Select category from dropdown menu
2. Quiz resets with questions from that category
3. Daily questions refresh every 24 hours
4. Progress is tracked separately per category

**Benefits:**
- Targeted study for weak areas
- Comprehensive topic review
- Flexible learning approach
```

### 4. Update Question Format Section (around line 116-131)

Update the CSV format to include Category:
```csv
ID,Question,OptionA,OptionB,OptionC,OptionD,OptionE,CorrectAnswer,Explanation,ImageURL,Category
1,"A 45-year-old...",Option A,Option B,Option C,Option D,Option E,C,"Explanation...",,"Hand and Wrist"
Ch2_Q1,"Which of the following...",Option A,Option B,Option C,Option D,Option E,A,"Explanation...,,"Hand and Wrist"
```

**ID Formats:**
- Numeric IDs (1-66): Original questions
- Ch#_Q# format: Imported questions from chapters
  - Ch2 = Hand and Wrist
  - Ch3 = Shoulder
  - etc.

### 5. Update Project Structure Section (around line 64)

Add the "Difficult questions" folder:
```
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
```

Also update utilities section:
```
├── utilities/
│   ├── import_difficult_questions.py   # Import and categorize questions
│   ├── parser.py                       # Text parsing utilities
```

### 6. Add Import Questions Section (after Installation, around line 114)

```markdown
### Importing Questions from Chapters

To re-import the 270 questions from chapter files:

```bash
python3 utilities/import_difficult_questions.py
```

This will:
- Read all 9 chapter CSV files
- Map chapters to categories
- Merge with existing questions
- Add Category column
- Output updated ortho_questions.csv
```

### 7. Update Statistics Throughout

Replace any mention of old question counts with:
- Total questions: **336**
- Original questions: **66**
- Imported chapter questions: **270**
- Categories: **9**
- Daily quiz size: **10 questions**
- Unique daily quizzes: **~33 days** (336/10)

## Expected Result

The README should now:
1. ✅ Show 336 total questions
2. ✅ List all 9 categories with ~30 questions each
3. ✅ Explain category filtering feature
4. ✅ Document both ID formats (numeric and Ch#_Q#)
5. ✅ Include import script documentation
6. ✅ Update project structure with chapter files
7. ✅ Maintain professional, educational tone

## Output Format

Please provide:
1. Confirmation that all 7 changes were made
2. Line numbers where major sections were updated
3. Any inconsistencies found in the original README
4. The total word count of the updated README
