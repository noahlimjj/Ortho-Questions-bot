#!/usr/bin/env node

const fs = require('fs').promises;
const { parse } = require('csv-parse/sync');

async function testCSV() {
  try {
    console.log('🔍 Testing CSV parsing...\n');

    const csvContent = await fs.readFile('ortho_questions.csv', 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true
    });

    console.log('✅ CSV parsed successfully!');
    console.log(`   Total records: ${records.length}`);

    const missingE = records.filter(r => !r.OptionE || r.OptionE.trim() === '').length;
    console.log(`   Questions with missing Option E: ${missingE}`);
    console.log(`   Questions with Option E: ${records.length - missingE}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ CSV parsing failed!');
    console.error(`   Error: ${error.message}\n`);
    process.exit(1);
  }
}

testCSV();
