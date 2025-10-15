#!/usr/bin/env node

const fs = require('fs').promises;
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

async function shuffleQuestions() {
  try {
    console.log('🔀 Shuffling quiz questions...\n');

    // Read the CSV
    const csvContent = await fs.readFile('ortho_questions.csv', 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true
    });

    console.log(`Found ${records.length} questions\n`);

    // Create backup
    console.log('📦 Creating backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = `ortho_questions.csv.backup-${timestamp}`;
    await fs.copyFile('ortho_questions.csv', backupPath);
    console.log(`   ✅ Backup saved to: ${backupPath}\n`);

    // Fisher-Yates shuffle algorithm
    console.log('🎲 Shuffling questions...');
    for (let i = records.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [records[i], records[j]] = [records[j], records[i]];
    }
    console.log('   ✅ Questions shuffled randomly (IDs preserved)\n');

    // Write shuffled CSV
    console.log('💾 Writing shuffled CSV...');
    const shuffledCSV = stringify(records, {
      header: true,
      columns: ['ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'OptionE', 'CorrectAnswer', 'Explanation', 'ImageURL'],
      quoted: true,
      quoted_string: true
    });

    await fs.writeFile('ortho_questions.csv', shuffledCSV);
    console.log('   ✅ Shuffled CSV written successfully\n');

    // Verify
    const verifyContent = await fs.readFile('ortho_questions.csv', 'utf-8');
    const verifyRecords = parse(verifyContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true
    });

    console.log('✨ Summary:');
    console.log(`   Total questions: ${verifyRecords.length}`);
    console.log(`   First question ID: ${verifyRecords[0].ID} - ${verifyRecords[0].Question.substring(0, 50)}...`);
    console.log(`   Last question ID: ${verifyRecords[verifyRecords.length - 1].ID} - ${verifyRecords[verifyRecords.length - 1].Question.substring(0, 50)}...`);
    console.log(`\n🎉 Questions have been randomly shuffled!`);
    console.log(`   Original IDs preserved for tracking`);
    console.log(`   Backup available at: ${backupPath}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

shuffleQuestions();
