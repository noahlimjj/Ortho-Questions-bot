#!/usr/bin/env node

const fs = require('fs').promises;
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

async function addOptionE() {
  try {
    console.log('🔍 Reading CSV and identifying questions missing Option E...\n');

    const csvContent = await fs.readFile('ortho_questions.csv', 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true
    });

    const missing = records.filter(r => !r.OptionE || r.OptionE.trim() === '');

    console.log(`Found ${missing.length} questions missing Option E:\n`);

    missing.forEach((q, i) => {
      console.log(`${i + 1}. ID ${q.ID}: ${q.Question.substring(0, 80)}...`);
      console.log(`   Current options: A) ${q.OptionA.substring(0, 40)}, B) ${q.OptionB.substring(0, 40)}, C) ${q.OptionC.substring(0, 40)}, D) ${q.OptionD.substring(0, 40)}`);
      console.log(`   Correct answer: ${q.CorrectAnswer}\n`);
    });

    // Export to JSON for processing
    await fs.writeFile(
      'scripts/missing-option-e.json',
      JSON.stringify(missing, null, 2)
    );

    console.log(`\n✅ Exported ${missing.length} questions to scripts/missing-option-e.json`);
    console.log('Next: Generate appropriate medical distractors for these questions');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addOptionE();
