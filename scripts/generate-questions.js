#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const axios = require('axios');

// Configuration
const REPO_ROOT = path.join(__dirname, '..');
const CSV_PATH = path.join(REPO_ROOT, 'ortho_questions.csv');
const PROMPT_PATH = path.join(REPO_ROOT, 'QUESTION_BUILDER_PROMPT.md');
const TRACKER_PATH = path.join(__dirname, 'domain-tracker.json');
const QUESTIONS_PER_RUN = 10;

// Main execution
async function main() {
  try {
    console.log('🏥 Starting Orthopedic Questions Generator...\n');

    // Step 1: Read existing questions
    console.log('📊 Reading existing questions...');
    const existingQuestions = await readExistingQuestions();
    const lastId = getLastQuestionId(existingQuestions);
    console.log(`   Last question ID: ${lastId}`);
    console.log(`   Total questions: ${existingQuestions.length}\n`);

    // Step 2: Read prompt template
    console.log('📋 Reading prompt template...');
    const promptTemplate = await fs.readFile(PROMPT_PATH, 'utf-8');
    console.log('   Prompt template loaded\n');

    // Step 3: Get current domain
    console.log('🔄 Determining current domain...');
    const tracker = await readTracker();
    const currentDomain = tracker.domains[tracker.currentDomainIndex];
    console.log(`   Current domain: ${currentDomain} (index ${tracker.currentDomainIndex})\n`);

    // Step 4: Build complete prompt
    console.log('🔨 Building prompt with context...');
    const prompt = buildPrompt(promptTemplate, currentDomain, lastId, existingQuestions);
    console.log(`   Prompt size: ${prompt.length} characters\n`);

    // Step 5: Call Perplexity API
    console.log('🤖 Calling Perplexity API...');
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY environment variable is not set');
    }
    const generatedQuestions = await callPerplexityAPI(apiKey, prompt);
    console.log(`   Generated ${generatedQuestions.length} questions\n`);

    // Step 6: Validate generated questions
    console.log('✅ Validating questions...');
    const validatedQuestions = validateQuestions(generatedQuestions, lastId, existingQuestions);
    console.log(`   ${validatedQuestions.length} questions passed validation\n`);

    if (validatedQuestions.length === 0) {
      throw new Error('No valid questions generated. Aborting.');
    }

    // Step 7: Append to CSV
    console.log('💾 Appending questions to CSV...');
    await appendToCSV(validatedQuestions);
    console.log(`   ${validatedQuestions.length} questions added to ortho_questions.csv\n`);

    // Step 8: Update tracker
    console.log('🔄 Updating domain tracker...');
    await updateTracker(tracker);
    console.log(`   Next domain: ${tracker.domains[(tracker.currentDomainIndex + 1) % tracker.domains.length]}\n`);

    // Step 9: Summary
    console.log('✨ Success!');
    console.log(`   Domain: ${currentDomain}`);
    console.log(`   Questions generated: ${validatedQuestions.length}`);
    console.log(`   New total: ${existingQuestions.length + validatedQuestions.length}`);
    console.log(`   Next run: ${tracker.domains[(tracker.currentDomainIndex + 1) % tracker.domains.length]}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Read existing questions from CSV
async function readExistingQuestions() {
  try {
    const csvContent = await fs.readFile(CSV_PATH, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    return records;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Get the last question ID
function getLastQuestionId(questions) {
  if (questions.length === 0) return 0;
  const ids = questions.map(q => parseInt(q.ID, 10)).filter(id => !isNaN(id));
  return Math.max(...ids);
}

// Read domain tracker
async function readTracker() {
  try {
    const content = await fs.readFile(TRACKER_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // Return default if file doesn't exist
    return {
      currentDomainIndex: 0,
      lastRunDate: '',
      domains: [
        'Trauma',
        'Spine',
        'Shoulder and Elbow',
        'Wrist/Hand',
        'Hip and Knee',
        'Foot and Ankle',
        'Orthopedic Emergencies'
      ]
    };
  }
}

// Build complete prompt with context
function buildPrompt(template, domain, lastId, existingQuestions) {
  const nextId = lastId + 1;

  // Extract question summaries to help avoid duplicates
  const questionSummaries = existingQuestions
    .slice(-20) // Last 20 questions to keep prompt manageable
    .map(q => `ID ${q.ID}: ${q.Question.substring(0, 100)}...`)
    .join('\n');

  const contextualPrompt = `You are an expert orthopedic surgeon and medical educator.

CURRENT STATE:
- Last question ID in database: ${lastId}
- Total questions in database: ${existingQuestions.length}
- Domain for this generation: ${domain}

RECENT QUESTIONS (to avoid duplicates):
${questionSummaries || 'None yet'}

YOUR TASK:
Generate ${QUESTIONS_PER_RUN} NEW high-yield, examination-level orthopedic questions for the domain: ${domain}

${template}

IMPORTANT REQUIREMENTS:
1. Start question IDs from ${nextId}
2. Generate exactly ${QUESTIONS_PER_RUN} questions
3. All questions must be about ${domain}
4. Output ONLY valid CSV rows (no markdown, no headers, no extra text)
5. Each row must follow this exact format:
   ID,Question,OptionA,OptionB,OptionC,OptionD,OptionE,CorrectAnswer,Explanation
6. Wrap fields containing commas in double quotes
7. Escape internal quotes by doubling them ("")
8. No newlines within fields

OUTPUT FORMAT:
Return ONLY the CSV rows, nothing else. No markdown code blocks, no explanations, just CSV.

Example of expected output (3 questions):
${nextId},"A 45-year-old man presents with...",Option A,Option B,Option C,Option D,Option E,C,"Explanation here..."
${nextId + 1},"A 67-year-old woman...",Option A,Option B,Option C,Option D,Option E,A,"Explanation here..."
${nextId + 2},"What is the most...",Option A,Option B,Option C,Option D,Option E,B,"Explanation here..."

Now generate ${QUESTIONS_PER_RUN} questions for ${domain}:`;

  return contextualPrompt;
}

// Call Perplexity API
async function callPerplexityAPI(apiKey, prompt) {
  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'llama-3.1-sonar-large-128k-online', // Using online model for medical accuracy
        messages: [
          {
            role: 'system',
            content: 'You are an expert orthopedic surgeon creating high-quality medical examination questions. Output only valid CSV data, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, accurate output
        max_tokens: 4000,
        return_related_questions: false,
        return_citations: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;

    // Clean up the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    cleanedContent = cleanedContent.replace(/^```csv\n?/gm, '');
    cleanedContent = cleanedContent.replace(/^```\n?/gm, '');
    cleanedContent = cleanedContent.replace(/```$/gm, '');
    cleanedContent = cleanedContent.trim();

    // Parse CSV
    const records = parse(cleanedContent, {
      columns: ['ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'OptionE', 'CorrectAnswer', 'Explanation'],
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true
    });

    return records;
  } catch (error) {
    if (error.response) {
      throw new Error(`Perplexity API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Validate generated questions
function validateQuestions(questions, lastId, existingQuestions) {
  const validated = [];

  for (const question of questions) {
    const issues = [];

    // Check required fields
    if (!question.ID || !question.Question || !question.OptionA || !question.OptionB ||
        !question.OptionC || !question.OptionD || !question.OptionE ||
        !question.CorrectAnswer || !question.Explanation) {
      issues.push('Missing required fields');
    }

    // Validate ID
    const id = parseInt(question.ID, 10);
    if (isNaN(id) || id <= lastId) {
      issues.push(`Invalid ID: ${question.ID} (must be > ${lastId})`);
    }

    // Validate correct answer
    if (!['A', 'B', 'C', 'D', 'E'].includes(question.CorrectAnswer)) {
      issues.push(`Invalid CorrectAnswer: ${question.CorrectAnswer}`);
    }

    // Check for duplicate questions (simple text match on first 100 chars)
    const questionPrefix = question.Question.substring(0, 100).toLowerCase();
    const isDuplicate = existingQuestions.some(
      eq => eq.Question.substring(0, 100).toLowerCase() === questionPrefix
    );
    if (isDuplicate) {
      issues.push('Duplicate question detected');
    }

    // Check minimum length
    if (question.Question.length < 20) {
      issues.push('Question too short');
    }
    if (question.Explanation.length < 30) {
      issues.push('Explanation too short');
    }

    if (issues.length === 0) {
      validated.push(question);
    } else {
      console.warn(`   ⚠️  Skipping question ${question.ID}: ${issues.join(', ')}`);
    }
  }

  return validated;
}

// Append validated questions to CSV
async function appendToCSV(questions) {
  const csvRows = stringify(questions, {
    header: false,
    columns: ['ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'OptionE', 'CorrectAnswer', 'Explanation']
  });

  await fs.appendFile(CSV_PATH, csvRows);
}

// Update domain tracker
async function updateTracker(tracker) {
  const nextIndex = (tracker.currentDomainIndex + 1) % tracker.domains.length;
  const today = new Date().toISOString().split('T')[0];

  const updated = {
    ...tracker,
    currentDomainIndex: nextIndex,
    lastRunDate: today
  };

  await fs.writeFile(TRACKER_PATH, JSON.stringify(updated, null, 2));
}

// Run main function
main();
