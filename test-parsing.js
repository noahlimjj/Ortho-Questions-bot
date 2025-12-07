#!/usr/bin/env node

/**
 * Test CSV parsing with new ID format
 */

const fs = require('fs');

// Simple CSV parser (same logic as in script.js)
function parseCSV(text) {
    const parsed = (str => {
        const arr = [];
        let quote = false;
        for (let row = 0, col = 0, c = 0; c < str.length; c++) {
            let cc = str[c], nc = str[c+1];
            arr[row] = arr[row] || [];
            arr[row][col] = arr[row][col] || '';
            if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
            if (cc == '"') { quote = !quote; continue; }
            if (cc == ',' && !quote) { ++col; continue; }
            if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
            if (cc == '\n' && !quote) { ++row; col = 0; continue; }
            if (cc == '\r' && !quote) { ++row; col = 0; continue; }
            arr[row][col] += cc;
        }
        return arr;
    })(text);

    const headers = parsed[0].map(h => h.trim());
    const idIndex = headers.indexOf('ID');
    const questionIndex = headers.indexOf('Question');
    const optionAIndex = headers.indexOf('OptionA');
    const optionBIndex = headers.indexOf('OptionB');
    const optionCIndex = headers.indexOf('OptionC');
    const optionDIndex = headers.indexOf('OptionD');
    const optionEIndex = headers.indexOf('OptionE');
    const answerIndex = headers.indexOf('CorrectAnswer');
    const explanationIndex = headers.indexOf('Explanation');
    const imageUrlIndex = headers.indexOf('ImageURL');
    const categoryIndex = headers.indexOf('Category');

    return parsed.slice(1)
        .filter(row => row && row[idIndex] && row[idIndex].trim() !== '')
        .map(row => {
            const options = [
                row[optionAIndex],
                row[optionBIndex],
                row[optionCIndex],
                row[optionDIndex],
                row[optionEIndex],
            ];

            let correctAnswerText = '';
            const correctLetter = row[answerIndex];
            if (correctLetter === 'A') correctAnswerText = row[optionAIndex];
            else if (correctLetter === 'B') correctAnswerText = row[optionBIndex];
            else if (correctLetter === 'C') correctAnswerText = row[optionCIndex];
            else if (correctLetter === 'D') correctAnswerText = row[optionDIndex];
            else if (correctLetter === 'E') correctAnswerText = row[optionEIndex];

            return {
                ID: row[idIndex], // Keep as string
                question: row[questionIndex],
                options: options.filter(o => o && o.trim() !== ''),
                answer: correctAnswerText,
                explanation: row[explanationIndex],
                imageUrl: row[imageUrlIndex] ? row[imageUrlIndex].trim() : null,
                category: row[categoryIndex] ? row[categoryIndex].trim() : ''
            };
        })
        .filter(q => q.ID && q.question && q.answer);
}

// Load and parse CSV
const csvText = fs.readFileSync('ortho_questions.csv', 'utf-8');
const questions = parseCSV(csvText);

console.log('🧪 CSV Parsing Test\n');
console.log('='.repeat(50));
console.log(`✅ Total questions parsed: ${questions.length}`);

// Check ID formats
const numericIDs = questions.filter(q => /^\d+$/.test(q.ID));
const chapterIDs = questions.filter(q => /^Ch\d+_Q\d+$/.test(q.ID));

console.log(`✅ Numeric IDs (original): ${numericIDs.length}`);
console.log(`✅ Chapter IDs (Ch#_Q#): ${chapterIDs.length}`);

// Category breakdown
const categories = {};
questions.forEach(q => {
    const cat = q.category || 'Uncategorized';
    categories[cat] = (categories[cat] || 0) + 1;
});

console.log('\n📊 Category Distribution:');
console.log('='.repeat(50));
Object.keys(categories).sort().forEach(cat => {
    console.log(`${cat.padEnd(25)}: ${categories[cat]}`);
});

// Sample questions
console.log('\n📝 Sample Questions:');
console.log('='.repeat(50));
console.log('Numeric ID example:', questions.find(q => /^\d+$/.test(q.ID))?.ID);
console.log('Chapter ID example:', questions.find(q => /^Ch2/.test(q.ID))?.ID);
console.log('Hand and Wrist:', questions.filter(q => q.category === 'Hand and Wrist').length);
console.log('Shoulder:', questions.filter(q => q.category === 'Shoulder').length);

// Check for parsing errors
const missingID = questions.filter(q => !q.ID);
const missingQuestion = questions.filter(q => !q.question);
const missingAnswer = questions.filter(q => !q.answer);

console.log('\n🔍 Quality Check:');
console.log('='.repeat(50));
console.log(`Missing IDs: ${missingID.length}`);
console.log(`Missing Questions: ${missingQuestion.length}`);
console.log(`Missing Answers: ${missingAnswer.length}`);

if (questions.length === 336 && chapterIDs.length === 270 && numericIDs.length === 66) {
    console.log('\n🎉 All checks passed! CSV parsing works correctly.');
} else {
    console.log('\n⚠️  Some counts are off:');
    console.log(`   Expected: 336 total, 270 chapter, 66 numeric`);
    console.log(`   Got: ${questions.length} total, ${chapterIDs.length} chapter, ${numericIDs.length} numeric`);
}

console.log('');
