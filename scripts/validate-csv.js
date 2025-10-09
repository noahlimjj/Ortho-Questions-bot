#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');

// Configuration
const REPO_ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(REPO_ROOT, 'ortho_questions.csv');

async function validateCSV() {
  try {
    console.log('🔍 Validating CSV file...\n');

    // Read CSV file
    const csvContent = await fs.readFile(CSV_PATH, 'utf-8');
    console.log(`📄 File size: ${csvContent.length} bytes`);

    // Parse CSV with strict settings
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: false,
      strict: true
    });

    console.log(`✅ CSV validation passed!\n`);
    console.log(`📊 Statistics:`);
    console.log(`   Total records: ${records.length}`);

    // Check for required columns
    const requiredColumns = ['ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Explanation'];
    const optionalColumns = ['ImageURL'];
    const columns = Object.keys(records[0] || {});
    console.log(`   Columns found: ${columns.join(', ')}`);

    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    if (missingColumns.length > 0) {
      console.warn(`   ⚠️  Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Validate ID sequence
    const ids = records.map(r => parseInt(r.ID, 10)).filter(id => !isNaN(id)).sort((a, b) => a - b);
    const lastId = ids[ids.length - 1];
    const firstId = ids[0];
    console.log(`   ID range: ${firstId} - ${lastId}`);

    // Check for duplicates
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      console.warn(`   ⚠️  Duplicate IDs detected!`);
    }

    // Validate each record
    let errors = 0;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const issues = [];

      // Check required fields
      if (!record.Question || record.Question.length < 10) {
        issues.push('Question too short or missing');
      }
      if (!record.CorrectAnswer || !['A', 'B', 'C', 'D'].includes(record.CorrectAnswer)) {
        issues.push(`Invalid CorrectAnswer: ${record.CorrectAnswer}`);
      }
      if (!record.Explanation || record.Explanation.length < 10) {
        issues.push('Explanation too short or missing');
      }
      if (!record.OptionA || !record.OptionB || !record.OptionC || !record.OptionD) {
        issues.push('Missing required options');
      }

      if (issues.length > 0) {
        console.error(`   ❌ Record ${i + 1} (ID ${record.ID}): ${issues.join(', ')}`);
        errors++;
      }
    }

    if (errors === 0) {
      console.log(`\n✨ All ${records.length} records are valid!`);
      process.exit(0);
    } else {
      console.error(`\n❌ Found ${errors} invalid records`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ CSV Validation Failed!');
    console.error(`   Error: ${error.message}`);

    if (error.message.includes('Invalid Closing Quote')) {
      console.error('\n💡 This error usually means:');
      console.error('   - A quoted field has characters after the closing quote');
      console.error('   - Check for improperly escaped quotes in the CSV');
      console.error('   - Look for trailing characters after quotes');
    }

    process.exit(1);
  }
}

validateCSV();
