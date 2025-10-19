# 📋 Plan: Import 240 Questions & Add Category Filtering

## Phase 1: Documentation & Organization (5 min)

### 1.1 Create Chapter Mapping Reference
Create `docs/CHAPTER_MAPPING.md`:
```markdown
# Chapter-to-Category Mapping

| Chapter | Category | Question Count |
|---------|----------|----------------|
| Ch2 | Hand and Wrist | 30 |
| Ch3 | Shoulder | 30 |
| Ch4 | Spine | 30 |
| Ch5 | Hip and Pelvis | 30 |
| Ch6 | Knee | 30 |
| Ch7 | Foot and Ankle | 30 |
| Ch8 | Pathology | 30 |
| Ch9 | Paediatrics | 30 |
| Ch10 | Trauma | 30 (if exists) |
```

### 1.2 Create AI Categorization Prompt
Create `docs/CATEGORIZE_EXISTING_QUESTIONS.md`:
- Prompt for LLM to categorize existing 66 questions
- Include all category definitions
- Request output in CSV format with Category column

---

## Phase 2: CSV Enhancement (10 min)

### 2.1 Add Category Column to CSV
- Update CSV header: `ID,Question,OptionA,...,ImageURL,Category`
- Keep ID as string (Ch2_Q1, Ch3_Q5, etc.)
- Map each chapter to category

### 2.2 Import All "Difficult Questions"
- Merge all 8 chapter CSV files (240 questions total)
- Preserve Ch#_Q# ID format
- Add Category column based on chapter mapping
- Result: ortho_questions.csv with ~306 questions

### 2.3 Handle Existing 66 Questions
- Keep current numeric IDs (1-66)
- Add Category column (initially blank/uncategorized)
- Create categorization task file for later

---

## Phase 3: UI Enhancement - Category Filter (20 min)

### 3.1 Update HTML (index.html)
Add category filter dropdown above quiz:
```html
<div id="category-filter" style="margin-bottom: 20px;">
    <label>Filter by Category:</label>
    <select id="category-select">
        <option value="all">All Categories (Mixed)</option>
        <option value="Hand and Wrist">Hand and Wrist</option>
        <option value="Shoulder">Shoulder</option>
        <option value="Spine">Spine</option>
        <option value="Hip and Pelvis">Hip and Pelvis</option>
        <option value="Knee">Knee</option>
        <option value="Foot and Ankle">Foot and Ankle</option>
        <option value="Pathology">Pathology</option>
        <option value="Paediatrics">Paediatrics</option>
        <option value="Trauma">Trauma</option>
        <option value="uncategorized">Uncategorized</option>
    </select>
</div>
```

### 3.2 Update JavaScript (script.js)
**Parse category from CSV:**
- Update parseCSV() to extract Category column
- Store category in question object

**Add filtering logic:**
- New variable: `selectedCategory = 'all'`
- Filter questions by category before daily selection
- Store category preference in localStorage
- Update initializeDaily() to respect category filter

**Update UI:**
- Display current category in progress bar
- Show "Filtered by: [Category]" indicator
- Allow switching categories (resets daily questions)

### 3.3 Enhanced Features
- Category stats: show question count per category
- "Study Mode": go through all questions in a category
- Progress tracking per category

---

## Phase 4: Script Updates (15 min)

### 4.1 Create Import Script
Create `utilities/import_difficult_questions.py`:
- Read all 8 chapter CSVs
- Keep Ch#_Q# IDs
- Add Category column
- Merge with existing ortho_questions.csv
- Validate format

### 4.2 Update CSV Parser
Modify script.js parseCSV():
- Handle both numeric and string IDs
- Extract category field
- Maintain backward compatibility

---

## Phase 5: Documentation (5 min)

### 5.1 Update README.md
- Document new category filtering feature
- Show 306 total questions
- List categories available
- Explain ID formats (numeric vs Ch#_Q#)

### 5.2 Create User Guide
Create `docs/CATEGORY_FILTER_GUIDE.md`:
- How to use category filter
- Difference between "All" and specific categories
- How progress tracking works per category

---

## Phase 6: Testing & Validation (5 min)

### 6.1 Validate CSV
- Check all 306 questions have proper format
- Verify Category column populated
- Test CSV parsing in browser

### 6.2 Test Category Filter
- Test each category filter
- Verify question counts
- Check localStorage persistence
- Test "All Categories" mode

---

## File Changes Summary:

### New Files:
1. `docs/CHAPTER_MAPPING.md` - Chapter reference
2. `docs/CATEGORIZE_EXISTING_QUESTIONS.md` - AI prompt for categorization
3. `docs/CATEGORY_FILTER_GUIDE.md` - User guide
4. `utilities/import_difficult_questions.py` - Import script

### Modified Files:
1. `ortho_questions.csv` - Add Category column, merge 240 questions
2. `index.html` - Add category filter dropdown
3. `script.js` - Add filtering logic, category support
4. `README.md` - Document new features

### No Changes:
- `style.css` (can enhance later if needed)
- Automation scripts (still work with new CSV format)
- GitHub Actions workflows

---

## Key Decisions:

✅ **Keep Ch#_Q# ID format** - More meaningful than renumbering
✅ **Add Category column** - Enables filtering without breaking existing IDs
✅ **Import all 240 questions** - Immediate value, no quality filtering needed
✅ **Separate categorization task** - For existing 66 questions (manual or AI-assisted)
✅ **Backward compatible** - Works with existing questions (category = blank/uncategorized)

---

## Estimated Time: ~60 minutes total

## Result:
- 306 total questions (66 existing + 240 new)
- Category filtering functionality
- Better organization and navigation
- ~30 days of unique daily quizzes
- Ability to study specific topics

---

## Implementation Order:

1. **First**: Create documentation files (CHAPTER_MAPPING.md, CATEGORIZE_EXISTING_QUESTIONS.md)
2. **Second**: Run import script to merge CSVs with Category column
3. **Third**: Update UI (HTML + JavaScript) for filtering
4. **Fourth**: Test thoroughly
5. **Fifth**: Commit and push to GitHub
6. **Last**: Categorize existing 66 questions (can be done later with AI assistance)

Ready to proceed!
