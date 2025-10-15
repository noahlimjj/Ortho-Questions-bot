#!/usr/bin/env node

const fs = require('fs').promises;
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

// Medically appropriate Option E distractors for each question
const optionEValues = {
  '1': 'Arthrogram',
  '2': 'Teres minor tear',
  '3': 'Bimalleolar fracture',
  '4': 'Delayed union',
  '5': 'Glenoid fracture',
  '6': 'Luxatio erecta',
  '7': 'Musculocutaneous nerve',
  '8': 'Improve femoral head vascularity',
  '9': 'Rheumatoid factor elevation',
  '10': 'Sacroiliitis',
  '15': 'N test is positive',
  '17': 'Contractility',
  '18': 'Intramedullary nail fixation and immediate wound closure',
  '21': 'Numbness over the thenar eminence',
  '22': 'Posterior drawer force',
  '23': 'Neer classification',
  '25': 'Percutaneous cannulated screw fixation with early mobilization',
  '26': 'Musculocutaneous nerve',
  '27': 'Coracoacromial ligament',
  '28': 'Triquetrum',
  '29': 'Classify fracture severity',
  '30': 'Malunion',
  '64': 'Aspiration pneumonitis',
  '70': 'Osteophytes at joint margins'
};

async function updateCSVWithOptionE() {
  try {
    console.log('🔍 Reading CSV file...\n');

    const csvContent = await fs.readFile('ortho_questions.csv', 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true
    });

    console.log(`Found ${records.length} total questions\n`);

    // Update records with Option E
    let updated = 0;
    records.forEach(record => {
      if ((!record.OptionE || record.OptionE.trim() === '') && optionEValues[record.ID]) {
        record.OptionE = optionEValues[record.ID];
        console.log(`✅ ID ${record.ID}: Added "${optionEValues[record.ID]}"`);
        updated++;
      }
    });

    console.log(`\n📝 Updated ${updated} questions with Option E\n`);

    // Create backup
    console.log('📦 Creating backup of original CSV...');
    const backupPath = 'ortho_questions.csv.backup-before-option-e';
    await fs.copyFile('ortho_questions.csv', backupPath);
    console.log(`   ✅ Backup saved to: ${backupPath}\n`);

    // Write updated CSV
    console.log('💾 Writing updated CSV...');
    const updatedCSV = stringify(records, {
      header: true,
      columns: ['ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'OptionE', 'CorrectAnswer', 'Explanation', 'ImageURL'],
      quoted: true,
      quoted_string: true
    });

    await fs.writeFile('ortho_questions.csv', updatedCSV);
    console.log('   ✅ CSV file updated successfully\n');

    // Verify
    const verifyContent = await fs.readFile('ortho_questions.csv', 'utf-8');
    const verifyRecords = parse(verifyContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true
    });

    const stillMissing = verifyRecords.filter(r => !r.OptionE || r.OptionE.trim() === '').length;

    console.log('✨ Summary:');
    console.log(`   Total questions: ${verifyRecords.length}`);
    console.log(`   Questions with Option E: ${verifyRecords.length - stillMissing}`);
    console.log(`   Questions still missing Option E: ${stillMissing}`);

    if (stillMissing === 0) {
      console.log('\n🎉 All questions now have 5 options (A-E)!');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

updateCSVWithOptionE();
