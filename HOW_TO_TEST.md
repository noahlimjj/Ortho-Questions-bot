# How to Test the Category Filtering Feature

## ⚠️ IMPORTANT: Clear Your Browser Data First!

The quiz uses localStorage to save your progress. You MUST clear it before testing the new category feature.

### Method 1: Use the "Clear & Restart" Button
1. Open http://localhost:8000/index.html
2. Click the **"Clear & Restart"** button below the progress bar
3. Refresh the page (F5)

### Method 2: Clear localStorage via Console
1. Open http://localhost:8000/index.html
2. Press F12 to open Developer Console
3. Type: `localStorage.clear()` and press Enter
4. Refresh the page (F5)

### Method 3: Clear Browser Data
1. Chrome: Settings → Privacy → Clear browsing data → Cookies and site data
2. Safari: Preferences → Privacy → Manage Website Data → Remove localhost
3. Firefox: Preferences → Privacy → Cookies and Site Data → Clear Data

---

## 🧪 Testing Steps

### Test 1: Default View (All Categories)
1. Clear localStorage (see above)
2. Open http://localhost:8000/index.html
3. **Expected**:
   - Category dropdown shows "All Categories (Mixed)"
   - 10 random questions from any category
   - Progress bar shows "Question 1/10 | Score: 0/0"

### Test 2: Hand and Wrist Category
1. Select **"Hand and Wrist"** from the dropdown
2. **Expected**:
   - Quiz resets immediately
   - Progress shows "Question 1/10 | Score: 0/0 | Hand and Wrist"
   - ALL 10 questions should be about hand/wrist topics
   - Question IDs should start with "Ch2_" (check console)

**Verify in Console (F12)**:
```javascript
dailyQuestions.forEach(id => console.log(id));
// Should see: Ch2_Q1, Ch2_Q5, Ch2_Q12, etc.
```

### Test 3: Shoulder Category
1. Select **"Shoulder"** from dropdown
2. **Expected**:
   - Quiz resets again
   - Progress shows "... | Shoulder"
   - ALL questions about shoulder
   - IDs start with "Ch3_"

### Test 4: Uncategorized
1. Select **"Uncategorized"** from dropdown
2. **Expected**:
   - Quiz resets
   - ALL questions are from the original 66
   - IDs are numbers (22, 24, 11, etc.) NOT Ch#_Q#

**Verify**:
```javascript
dailyQuestions.forEach(id => console.log(id));
// Should see: 22, 24, 11, 58, etc. (numeric IDs only)
```

### Test 5: Category Persistence
1. Select "Knee"
2. Answer 3-4 questions
3. **Refresh the page (F5)**
4. **Expected**:
   - Dropdown still shows "Knee"
   - Same 10 questions loaded
   - Your progress is saved

---

## 🔍 Debugging: Open Browser Console

Press **F12** and check the console output:

### What You Should See:
```
Total questions parsed: 330
Sample question IDs: ['22', '24', '11', '58', '42']
Questions by category: {
  'Hand and Wrist': 30,
  'Shoulder': 30,
  'Spine': 30,
  ...
}
```

### When You Select "Hand and Wrist":
```
Daily question IDs: ['Ch2_Q1', 'Ch2_Q15', 'Ch2_Q7', ...]
Today's questions count: 10 (expected: 10)
```

### Common Issues:

**Issue**: "Questions still mixing categories"
- **Fix**: Clear localStorage! `localStorage.clear()` then refresh

**Issue**: "No questions showing"
- **Fix**: Check console for errors. Make sure server is running.

**Issue**: "Only showing 5 questions instead of 10"
- **Not a bug**: Category might have fewer questions available

---

## ✅ What Success Looks Like

When you select **"Hand and Wrist"**, you should see questions like:
- "Which of the following is not a cause of a swan neck deformity?"
- "When performing a replant of an amputated finger..."
- "When performing flexor tendon repair which of the following pulleys..."

When you select **"Shoulder"**, you should see questions like:
- Questions about rotator cuff
- Questions about shoulder dislocations
- Questions about shoulder instability

When you select **"Uncategorized"**, you should see questions like:
- "Which classification system is most commonly used for hip fractures?" (ID: 22)
- "What factors would you not consider when deciding which muscle..." (ID: 24)

---

## 🎯 Quick Verification Commands

Open console (F12) and run:

```javascript
// Check total questions
console.log('Total:', questions.length); // Should be ~330

// Check Hand and Wrist questions
console.log('Hand and Wrist:',
  questions.filter(q => q.category === 'Hand and Wrist').length
); // Should be 30

// Check current filter
console.log('Selected category:', selectedCategory);

// Check daily questions
console.log('Daily question IDs:', dailyQuestions);

// Verify all daily questions match category
const daily = questions.filter(q => dailyQuestions.includes(q.ID));
console.log('All daily questions match category?',
  daily.every(q => selectedCategory === 'all' ||
                   q.category === selectedCategory ||
                   (selectedCategory === 'uncategorized' && !q.category))
);
```

---

## 📊 Expected Category Counts

| Category | Question Count |
|----------|---------------|
| Hand and Wrist | 30 |
| Shoulder | 30 |
| Spine | 30 |
| Hip and Pelvis | 30 |
| Knee | 30 |
| Foot and Ankle | 30 |
| Pathology | 30 |
| Paediatrics | 30 |
| Trauma | 30 |
| Uncategorized | 60 |

---

## 🚀 Quick Test Page

For faster testing, open:
**http://localhost:8000/quick-test.html**

This will automatically:
- Load all questions
- Test all categories
- Show which categories work
- Simulate filtering

---

## ❓ Still Not Working?

1. **Clear localStorage** (most common issue!)
2. **Hard refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. **Check server is running**: http://localhost:8000 should load
4. **Check console for errors**: Look for red error messages
5. **Try incognito/private mode**: Rules out caching issues

---

**Remember: The #1 issue is old localStorage data. Clear it first!**
