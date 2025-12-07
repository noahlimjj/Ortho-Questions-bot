# Testing Checklist: Category Filtering Feature

## Pre-Testing Setup

1. Open the project in a browser (local server or file:///)
2. Open Developer Console (F12) for debugging
3. Clear localStorage to start fresh: `Clear & Restart` button

## Test Cases

### Test 1: CSV Parsing with Category Column

**Steps:**
1. Open browser console
2. Check that questions are loaded
3. Run: `console.log(questions[0])`
4. Verify object has `category` field

**Expected:**
```javascript
{
  ID: 22,
  question: "Which classification system...",
  options: [...],
  answer: "Garden classification",
  explanation: "...",
  imageUrl: null,
  category: "" // Blank for original questions
}
```

**Run:** `console.log(questions.find(q => q.ID === 'Ch2_Q1' || q.question.includes('swan neck')))`

**Expected:**
```javascript
{
  ID: "Ch2_Q1",
  question: "Which of the following is not a cause of a swan neck deformity?",
  ...
  category: "Hand and Wrist"
}
```

✅ PASS / ❌ FAIL: _______

---

### Test 2: Default "All Categories" Mode

**Steps:**
1. Fresh load (clear storage)
2. Check category dropdown value
3. Start quiz
4. Note question IDs shown

**Expected:**
- Dropdown shows: "All Categories (Mixed)"
- Questions include mix of numeric IDs and Ch#_Q# IDs
- All 336 questions available

**Verification:**
- Run: `console.log(questions.length)` → Should be 336
- Run: `console.log(dailyQuestions.length)` → Should be 10

✅ PASS / ❌ FAIL: _______

---

### Test 3: Filter by "Hand and Wrist"

**Steps:**
1. Select "Hand and Wrist" from dropdown
2. Check console for filtered questions
3. Answer all 10 questions
4. Note all question IDs

**Expected:**
- Only Ch2_Q# questions shown
- ~30 questions available in this category
- Progress bar shows: "X/10 | Hand and Wrist"

**Verification:**
- Run: `console.log(dailyQuestions.every(q => q.category === 'Hand and Wrist'))`
- Should return: `true`

✅ PASS / ❌ FAIL: _______

---

### Test 4: Filter by "Shoulder"

**Steps:**
1. Select "Shoulder" from dropdown
2. Check that quiz resets
3. Verify all questions are Ch3_Q#

**Expected:**
- Quiz resets (answeredQuestions clears)
- Only Ch3_Q# questions
- ~30 shoulder questions available

**Verification:**
- Run: `console.log(dailyQuestions.map(q => q.ID))`
- All IDs should start with "Ch3_"

✅ PASS / ❌ FAIL: _______

---

### Test 5: Filter by "Uncategorized"

**Steps:**
1. Select "Uncategorized" from dropdown
2. Check questions shown
3. Verify all are numeric IDs (1-66)

**Expected:**
- Only original 66 questions
- All IDs are numbers (not Ch#_Q#)
- Questions have blank/empty category

**Verification:**
- Run: `console.log(dailyQuestions.every(q => !q.category || q.category === ''))`
- Should return: `true`

✅ PASS / ❌ FAIL: _______

---

### Test 6: Category Preference Persistence

**Steps:**
1. Select "Knee" category
2. Refresh the page (F5)
3. Check dropdown value

**Expected:**
- Dropdown still shows "Knee"
- Same filtered questions displayed
- localStorage preserves selectedCategory

**Verification:**
- Run: `localStorage.getItem('selectedCategory')`
- Should return: `"Knee"`

✅ PASS / ❌ FAIL: _______

---

### Test 7: Progress Bar Shows Category

**Steps:**
1. Select "Pathology"
2. Answer 3 questions
3. Check progress bar text

**Expected:**
- Shows: "3/10 | Pathology"
- Or similar format with category name

**Verification:**
- Visual inspection of progress bar element
- Should display current category

✅ PASS / ❌ FAIL: _______

---

### Test 8: Switch Categories Resets Progress

**Steps:**
1. Select "Trauma"
2. Answer 5 questions
3. Switch to "Spine"
4. Check answeredQuestions

**Expected:**
- Daily questions reset to new category
- Answered questions cleared
- Starts from question 1/10 again

**Verification:**
- Run: `console.log(answeredQuestions.length)`
- Should return: `0` (reset)

✅ PASS / ❌ FAIL: _______

---

### Test 9: All Categories Have Questions

**Steps:**
1. Test each category individually:
   - Hand and Wrist
   - Shoulder
   - Spine
   - Hip and Pelvis
   - Knee
   - Foot and Ankle
   - Pathology
   - Paediatrics
   - Trauma

**Expected:**
- Each category has ~30 questions
- All display correctly
- No errors in console

**Verification:**
For each category, run:
```javascript
console.log(
  selectedCategory,
  questions.filter(q => q.category === selectedCategory).length
);
```

✅ PASS / ❌ FAIL: _______

---

### Test 10: Question Count Accuracy

**Steps:**
1. Check total questions per category
2. Verify counts match expected

**Expected:**
```javascript
// Run this in console:
const categoryCounts = {};
questions.forEach(q => {
  const cat = q.category || 'Uncategorized';
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});
console.table(categoryCounts);
```

Should show:
- Hand and Wrist: ~30
- Shoulder: ~30
- Spine: ~30
- Hip and Pelvis: ~30
- Knee: ~30
- Foot and Ankle: ~30
- Pathology: ~30
- Paediatrics: ~30
- Trauma: ~30
- Uncategorized: 66
- **Total: 336**

✅ PASS / ❌ FAIL: _______

---

## Edge Cases

### Edge Case 1: Category with < 10 Questions

If a category has fewer than 10 questions:
- Should show all available questions
- No errors
- Still functions correctly

✅ PASS / ❌ FAIL: _______

---

### Edge Case 2: Empty Category

If a category has 0 questions:
- Should show message or empty state
- No JavaScript errors
- Can still switch to other categories

✅ PASS / ❌ FAIL: _______

---

## Performance Checks

1. **Load Time**: Questions load in < 2 seconds
2. **Category Switch**: Instant (<100ms)
3. **No Memory Leaks**: Console has no warnings after 20+ category switches
4. **localStorage Size**: Stays under 5MB

✅ PASS / ❌ FAIL: _______

---

## Final Verification

Run this comprehensive check:

```javascript
// Total questions check
console.assert(questions.length === 336, 'Should have 336 total questions');

// Category field exists
console.assert(questions.every(q => 'category' in q), 'All questions should have category field');

// Original questions have no category
const oldQuestions = questions.filter(q => typeof q.ID === 'number');
console.assert(oldQuestions.every(q => !q.category || q.category === ''), 'Old questions should have blank category');

// New questions have category
const newQuestions = questions.filter(q => typeof q.ID === 'string' && q.ID.includes('Ch'));
console.assert(newQuestions.every(q => q.category && q.category !== ''), 'New questions should have category');

console.log('✅ All assertions passed!');
```

✅ ALL CHECKS PASS / ❌ SOME FAILED

---

## Test Summary

| Test | Status | Notes |
|------|--------|-------|
| CSV Parsing | ☐ | |
| Default All Categories | ☐ | |
| Hand and Wrist Filter | ☐ | |
| Shoulder Filter | ☐ | |
| Uncategorized Filter | ☐ | |
| Persistence | ☐ | |
| Progress Bar | ☐ | |
| Category Switch Reset | ☐ | |
| All Categories Work | ☐ | |
| Question Counts | ☐ | |
| Edge Cases | ☐ | |
| Performance | ☐ | |
| Final Verification | ☐ | |

**Overall Status:** ☐ READY FOR PRODUCTION / ☐ NEEDS FIXES

---

## Issues Found

List any bugs or issues discovered during testing:

1.
2.
3.

---

## Next Steps After Testing

1. ✅ All tests pass → Commit and push
2. ❌ Issues found → Fix and retest
3. Document any known limitations
4. Update user guide if needed
