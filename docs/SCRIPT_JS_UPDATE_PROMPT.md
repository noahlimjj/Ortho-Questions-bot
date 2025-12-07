# Task: Update script.js to Support Category Filtering

## Context
We've added a category filter dropdown to index.html and imported 240+ questions with categories. Now script.js needs to be updated to:
1. Parse the Category column from CSV
2. Implement category filtering logic
3. Store category preference in localStorage
4. Update progress display to show current category

## File to Update
`script.js` at `/Users/User/Desktop/Projects/Ortho Questions bot/script.js`

## Changes Required

### 1. Update parseCSV() function (around line 22-82)

Add categoryIndex after imageUrlIndex:
```javascript
const imageUrlIndex = headers.indexOf('ImageURL');
const categoryIndex = headers.indexOf('Category');
```

In the return object (around line 72-79), add category field:
```javascript
return {
    ID: parseInt(row[idIndex], 10),
    question: row[questionIndex],
    options: options.filter(o => o && o.trim() !== ''),
    answer: correctAnswerText,
    explanation: row[explanationIndex],
    imageUrl: row[imageUrlIndex] ? row[imageUrlIndex].trim() : null,
    category: row[categoryIndex] ? row[categoryIndex].trim() : '' // Add this line
};
```

### 2. Add Category Selection Variables (after line 19)

Add these variables after the existing declarations:
```javascript
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';
```

### 3. Add Category Filter Event Listener (in loadQuestions or after it)

Add this code after the loadQuestions() function (around line 98):
```javascript
// Category filter event listener
const categorySelect = document.getElementById('category-select');
if (categorySelect) {
    // Set initial value from localStorage
    categorySelect.value = selectedCategory;

    categorySelect.addEventListener('change', function() {
        selectedCategory = this.value;
        localStorage.setItem('selectedCategory', selectedCategory);

        // Reset daily questions when category changes
        dailyQuestions = [];
        localStorage.setItem('dailyQuestions', JSON.stringify(dailyQuestions));
        answeredQuestions = [];
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));

        // Reinitialize
        currentQuestionIndex = 0;
        initializeDaily();
    });
}
```

### 4. Update initializeDaily() Function

Find the initializeDaily() function and modify the question selection logic to filter by category.

Look for the line that selects 10 random questions (something like):
```javascript
dailyQuestions = shuffled.slice(0, 10);
```

Replace the question selection logic with:
```javascript
// Filter questions by category if selected
let filteredQuestions = questions;
if (selectedCategory !== 'all') {
    if (selectedCategory === 'uncategorized') {
        filteredQuestions = questions.filter(q => !q.category || q.category === '');
    } else {
        filteredQuestions = questions.filter(q => q.category === selectedCategory);
    }
}

// Shuffle and select 10 questions from filtered set
const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
dailyQuestions = shuffled.slice(0, Math.min(10, shuffled.length));
```

### 5. Update Progress Bar Display

Find the updateProgressBar() function or where progress is displayed and add category info.

Add this after the existing progress text:
```javascript
if (selectedCategory !== 'all') {
    progressBar.innerHTML += ` <span style="color: #888; font-size: 0.9em;">| ${selectedCategory}</span>`;
}
```

## Testing Requirements

After making changes, test:
1. ✅ CSV parsing includes category field
2. ✅ Category dropdown changes filter questions
3. ✅ Progress resets when category changes
4. ✅ Category preference persists in localStorage
5. ✅ "All Categories" shows all questions
6. ✅ Specific categories show only those questions
7. ✅ "Uncategorized" shows questions with blank category

## Expected Behavior

- **Default**: Show all 336 questions (mixed categories)
- **Select "Hand and Wrist"**: Show only ~30 Ch2 questions
- **Select "Uncategorized"**: Show original 66 questions without category
- **Category changes**: Reset daily quiz and show new set

## Output Format

Please provide:
1. Confirmation of each change made
2. Line numbers where changes were applied
3. Any issues encountered
4. Test results for all 7 test cases above
