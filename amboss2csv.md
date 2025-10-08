# Import Guide: amboss_qns.txt to ortho_questions.csv

## Overview
This document provides instructions for LLM subagents to convert questions from `amboss_qns.txt` (text format) into `ortho_questions.csv` (CSV format) for the Ortho Quiz Bot.

---

## Current File Formats

### Source: amboss_qns.txt
```
Question number. Question text?
a. Option A text
b. Option B text
c. Option C text
d. Option D text
e. Option E text
Ans: [Letter]
Explanation: [Explanation text]

[blank line between questions]
```

**Example:**
```
1. What is the order of the normal healing process of bones?
a. Hematoma, soft callus, hard callus, woven bone, lamellar bone
b. soft callus, hard callus, lamellar bone, woven bone
c. Hematoma, soft callus, lamellar bone, hard callus, woven bone
d. Soft callus, hematoma, hard callus, lamellar bone, woven bone
e. Hematoma, soft callus, hard callus, lamellar bone, woven bone
Ans: A
Explanation: The normal healing process involves hematoma, soft callus, hard callus, woven bone, then lamellar bone.
```

### Target: ortho_questions.csv
```
ID,Question,OptionA,OptionB,OptionC,OptionD,OptionE,CorrectAnswer,Explanation
```

**Example:**
```csv
39,"What is the order of the normal healing process of bones?","Hematoma, soft callus, hard callus, woven bone, lamellar bone","soft callus, hard callus, lamellar bone, woven bone","Hematoma, soft callus, lamellar bone, hard callus, woven bone","Soft callus, hematoma, hard callus, lamellar bone, woven bone","Hematoma, soft callus, hard callus, lamellar bone, woven bone",A,"The normal healing process involves hematoma, soft callus, hard callus, woven bone, then lamellar bone."
```

---

## Import Steps

### Step 1: Read Both Files
1. Read `ortho_questions.csv` to get:
   - Last ID used (to determine starting ID for new questions)
   - All existing question texts (for duplicate detection)
2. Read `amboss_qns.txt` to extract raw questions

### Step 2: Parse Each Question from amboss_qns.txt

For each question block:

1. **Extract Question Number & Text**
   - Pattern: `^\d+\.\s+(.+)$`
   - Handle multi-line questions (continue reading until you hit "a. ")

2. **Extract Options A-E**
   - Pattern: `^[a-e]\.\s+(.+)$`
   - Strip the letter prefix and period
   - Preserve the full option text
   - **CRITICAL: All 5 options (a-e) must be present**

3. **Extract Answer**
   - Pattern: `^Ans:\s+([A-E])$`
   - Keep only the letter (A, B, C, D, or E)

4. **Extract Explanation (optional)**
   - Pattern: `^Explanation:\s+(.+)$`
   - May span multiple lines
   - If missing, leave empty

### Step 3: Check for Duplicates

Compare the question text with all existing questions in `ortho_questions.csv`:
- **If duplicate found**:
  - Check if existing row has empty OptionE
  - If yes, UPDATE the existing row with OptionE from amboss
  - If no, SKIP (question already complete)
- **If unique**:
  - Assign new ID (last_id + 1)
  - Mark for insertion

### Step 4: Convert to CSV Format

For each new question:

1. **Assign ID**: Use next sequential ID from CSV
2. **Format Fields**:
   - Wrap any field containing commas in double quotes
   - Escape internal quotes by doubling them: `"` → `""`
   - Remove newlines within fields (replace with space)
3. **Build CSV Row**:
   ```
   ID,Question,OptionA,OptionB,OptionC,OptionD,OptionE,CorrectAnswer,Explanation
   ```

### Step 5: Append to ortho_questions.csv

- Append new rows at the end of the file
- DO NOT modify the header row
- DO NOT modify existing question rows (unless updating OptionE for duplicates)
- Maintain proper CSV formatting

---

## Special Cases

### Multi-line Questions
Some questions span multiple lines (especially clinical vignettes):

```
2. A 47 year old woman, who had just finished her surgical fixation for a complex
distal radial fracture of the right arm 12 hours ago, complains of severe forearm
pain in the PACU...
```

**Handling**: Concatenate all lines until you encounter "a. ", then treat as single question text.

### Questions with Sub-options
Some questions have numbered lists before the a-e options:

```
5. Which of the following would you want to consider?
1: IV morphine
2: IV cefazolin
3: Tetanus toxoid
4: wound debridement
a. 4
b. 2 and 4
c. 2, 3 and 4
d. 1, 2, 3 and 4
e. None of the above
```

**Handling**: Include the numbered list as part of the question text.

### Missing Explanations
If no explanation line exists:
- Leave the Explanation field empty in CSV
- The app will display "No explanation available"

---

## CSV Formatting Rules

### Quoting Rules
- Fields with commas MUST be quoted:
  ```csv
  "Hematoma, soft callus, hard callus"
  ```
- Fields without commas MAY be quoted (but not required):
  ```csv
  "Simple text" or Simple text (both valid)
  ```

### Escaping Rules
- Internal quotes must be doubled:
  ```csv
  "The patient's ""drop arm test"" was positive"
  ```

### Newline Handling
- Remove newlines within fields
- Replace with single space
- Example: `"Line 1\nLine 2"` → `"Line 1 Line 2"`

---

## Validation Checklist

After conversion, verify:

- [ ] All questions have exactly 5 options (A, B, C, D, E)
- [ ] All CorrectAnswer values are single letters (A-E)
- [ ] No duplicate IDs in the CSV
- [ ] CSV syntax is valid (balanced quotes)
- [ ] OptionE is filled for all questions (never empty)
- [ ] Question text is complete and readable
- [ ] Options are properly extracted (no "a. " prefixes)

---

## Example Conversion

### Input (amboss_qns.txt):
```
3. Which one of the following is false about the clinical examinations of an ACL tear?
a. Posterior drawer is negative
b. Anterior drawer is positive
c. There is posterior sag of the knee
d. Lachman test is positive
e. Pivot shift is positive
Ans: C
Explanation: Posterior sag and drawer are positive for PCL tear.
```

### Output (CSV row):
```csv
41,Which one of the following is false about the clinical examinations of an ACL tear?,Posterior drawer is negative,Anterior drawer is positive,There is posterior sag of the knee,Lachman test is positive,Pivot shift is positive,C,Posterior sag and drawer are positive for PCL tear.
```

---

## Execution Prompt for Subagent

When ready to execute, use this prompt:

```
Read amboss_qns.txt and ortho_questions.csv.

For each question in amboss_qns.txt:
1. Parse question number, text, options a-e, answer, and explanation
2. Check if question already exists in CSV (compare question text)
3. If duplicate with empty OptionE: update existing row
4. If unique: create new CSV row with next sequential ID
5. Append new rows to ortho_questions.csv

Follow all formatting rules in amboss2csv.md.
Validate all questions have 5 options (A-E).
Do not modify existing complete questions.
```

---

## Notes
- This process is idempotent: running twice won't create duplicates
- Always backup ortho_questions.csv before running
- Test with a single question first to verify formatting
- The quiz app expects exactly 5 options per question
