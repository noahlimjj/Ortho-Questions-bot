#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

// Configuration
const REPO_ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(REPO_ROOT, 'ortho_questions.csv');
const BACKUP_PATH = path.join(REPO_ROOT, 'ortho_questions.csv.backup');

async function fixCSV() {
  try {
    console.log('🔧 CSV Repair Tool\n');

    // Backup original file
    console.log('📦 Creating backup...');
    const originalContent = await fs.readFile(CSV_PATH, 'utf-8');
    await fs.writeFile(BACKUP_PATH, originalContent);
    console.log(`   ✅ Backup saved to: ${BACKUP_PATH}\n`);

    // Try to parse with relaxed settings
    console.log('🔍 Parsing CSV with relaxed settings...');
    const records = parse(originalContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true,
      skip_records_with_error: true
    });

    console.log(`   Found ${records.length} parseable records\n`);

    // Filter and clean records
    console.log('🧹 Cleaning and validating records...');
    const cleanedRecords = [];
    let skipped = 0;

    for (const record of records) {
      // Check if record has required fields
      if (!record.ID || !record.Question || !record.OptionA || !record.OptionB ||
          !record.OptionC || !record.OptionD || !record.CorrectAnswer || !record.Explanation) {
        console.warn(`   ⚠️  Skipping invalid record: ID ${record.ID || 'unknown'}`);
        skipped++;
        continue;
      }

      // Validate ID is a number
      const id = parseInt(record.ID, 10);
      if (isNaN(id)) {
        console.warn(`   ⚠️  Skipping record with invalid ID: ${record.ID}`);
        skipped++;
        continue;
      }

      // Validate correct answer
      if (!['A', 'B', 'C', 'D'].includes(record.CorrectAnswer)) {
        console.warn(`   ⚠️  Skipping record ${id} with invalid answer: ${record.CorrectAnswer}`);
        skipped++;
        continue;
      }

      // Clean the record
      const cleaned = {
        ID: id.toString(),
        Question: record.Question.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
        OptionA: record.OptionA.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
        OptionB: record.OptionB.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
        OptionC: record.OptionC.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
        OptionD: record.OptionD.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
        CorrectAnswer: record.CorrectAnswer.trim(),
        Explanation: record.Explanation.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
        ImageURL: record.ImageURL || ''
      };

      cleanedRecords.push(cleaned);
    }

    console.log(`   ✅ Cleaned ${cleanedRecords.length} records`);
    console.log(`   ⚠️  Skipped ${skipped} invalid records\n`);

    // Re-sequence IDs if needed
    console.log('🔢 Re-sequencing IDs...');
    const resequenced = cleanedRecords.map((record, index) => ({
      ...record,
      ID: (index + 1).toString()
    }));
    console.log(`   ✅ IDs now range from 1 to ${resequenced.length}\n`);

    // Write cleaned CSV
    console.log('💾 Writing cleaned CSV...');
    const csvContent = stringify(resequenced, {
      header: true,
      columns: ['ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Explanation', 'ImageURL'],
      quoted: true,
      quoted_string: true
    });

    await fs.writeFile(CSV_PATH, csvContent);
    console.log(`   ✅ Cleaned CSV written to: ${CSV_PATH}\n`);

    // Validate the cleaned file
    console.log('✅ Validating cleaned CSV...');
    const validationContent = await fs.readFile(CSV_PATH, 'utf-8');
    const validated = parse(validationContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: false,
      strict: true
    });

    console.log(`   ✅ Validation passed: ${validated.length} records\n`);

    console.log('✨ CSV repair complete!');
    console.log(`   Original records: ${records.length}`);
    console.log(`   Final records: ${validated.length}`);
    console.log(`   Backup location: ${BACKUP_PATH}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ CSV repair failed!');
    console.error(`   Error: ${error.message}`);
    console.error('\n   The backup file has been preserved.');
    process.exit(1);
  }
}

fixCSV();
