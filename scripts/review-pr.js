#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { Octokit } = require('@octokit/rest');

// Configuration
const REPO_ROOT = path.join(__dirname, '..');
const VALIDATOR_PROMPT_PATH = path.join(__dirname, 'claude-validator-prompt.md');
const PASSING_SCORE = 9.0;

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPOSITORY?.split('/')[0] || 'noahlimjj';
const REPO_NAME = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Ortho-Questions-bot';

// Initialize clients
let octokit;
let anthropic;

async function main() {
  try {
    console.log('🔍 Starting automated PR review...\n');

    // Initialize clients
    console.log('🔧 Initializing API clients...');
    await initializeClients();
    console.log('   ✓ Clients initialized\n');

    // Find open automated PRs
    console.log('📋 Finding open automated PRs...');
    const prs = await findAutomatedPRs();
    console.log(`   Found ${prs.length} PR(s) to review\n`);

    if (prs.length === 0) {
      console.log('✨ No PRs to review. Exiting.');
      process.exit(0);
    }

    // Review each PR
    for (const pr of prs) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📝 Reviewing PR #${pr.number}: ${pr.title}`);
      console.log(`${'='.repeat(60)}\n`);

      try {
        await reviewPR(pr);
      } catch (error) {
        console.error(`❌ Error reviewing PR #${pr.number}:`, error.message);
        await commentOnPR(pr.number, `## ❌ Review Failed\n\nError: ${error.message}\n\nThis PR requires manual review.`);
      }
    }

    console.log('\n✨ All PRs reviewed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

async function initializeClients() {
  // Initialize GitHub client
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }
  octokit = new Octokit({ auth: GITHUB_TOKEN });

  // Initialize Anthropic client
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  anthropic = new Anthropic({ apiKey });
}

async function findAutomatedPRs() {
  const { data: prs } = await octokit.pulls.list({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    state: 'open',
    sort: 'created',
    direction: 'desc'
  });

  // Filter for automated PRs (created by GitHub Actions)
  return prs.filter(pr =>
    pr.labels.some(label => label.name === 'automated') ||
    pr.title.includes('Daily Questions')
  );
}

async function reviewPR(pr) {
  // Step 1: Get PR diff
  console.log('   📥 Fetching PR changes...');
  const questions = await getPRQuestions(pr.number);
  console.log(`   Found ${questions.length} questions to review\n`);

  if (questions.length === 0) {
    console.log('   ⚠️  No questions found in PR. Skipping.');
    return;
  }

  // Step 2: Load validation prompt
  console.log('   📋 Loading validation prompt...');
  const validatorPrompt = await fs.readFile(VALIDATOR_PROMPT_PATH, 'utf-8');

  // Step 3: Call Claude for validation
  console.log('   🤖 Calling Claude API for validation...');
  const validation = await validateWithClaude(validatorPrompt, questions);
  console.log(`   Score: ${validation.overallScore}/${validation.maxScore}`);
  console.log(`   Status: ${validation.passed ? '✅ PASSED' : '❌ FAILED'}\n`);

  // Step 4: Post results as comment
  console.log('   💬 Posting review comment...');
  await postReviewComment(pr.number, validation);

  // Step 5: Auto-merge if passed
  if (validation.passed && validation.overallScore >= PASSING_SCORE) {
    console.log('   ✅ Validation passed - Auto-merging...');
    // Skip approval step (GitHub Actions can't approve its own PRs)
    // Just merge directly if validation passed
    await mergePR(pr.number);
    console.log('   🎉 PR merged successfully!');
  } else {
    console.log('   ⚠️  Validation failed - Assigning for manual review...');
    await assignPRForReview(pr.number);
  }
}

async function getPRQuestions(prNumber) {
  // Get PR files
  const { data: files } = await octokit.pulls.listFiles({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: prNumber
  });

  // Find ortho_questions.csv changes
  const csvFile = files.find(f => f.filename === 'ortho_questions.csv');
  if (!csvFile || !csvFile.patch) {
    return [];
  }

  // Extract added lines (new questions) from patch
  const addedLines = csvFile.patch
    .split('\n')
    .filter(line => line.startsWith('+') && !line.startsWith('+++'))
    .map(line => line.substring(1).trim())
    .filter(line => line.length > 0 && !line.startsWith('ID,Question')); // Skip header

  return addedLines;
}

async function validateWithClaude(promptTemplate, questions) {
  // Build complete prompt
  const questionsText = questions.join('\n');
  const fullPrompt = promptTemplate.replace('[QUESTIONS WILL BE INSERTED HERE]',
    `\`\`\`csv\n${questionsText}\n\`\`\``);

  // Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: fullPrompt
      }
    ]
  });

  // Extract JSON from response
  const responseText = message.content[0].text;

  // Try to extract JSON from markdown code blocks if present
  let jsonText = responseText;
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  // Parse validation result
  try {
    const validation = JSON.parse(jsonText);
    return validation;
  } catch (error) {
    console.error('Failed to parse Claude response as JSON:', responseText);
    throw new Error('Claude did not return valid JSON. Response: ' + responseText.substring(0, 200));
  }
}

async function postReviewComment(prNumber, validation) {
  const { passed, overallScore, maxScore, summary, questionReviews, criticalIssues, recommendations } = validation;

  const status = passed ? '✅ PASSED' : '❌ FAILED';
  const emoji = passed ? '🎉' : '⚠️';

  let comment = `## ${emoji} Automated Review Results\n\n`;
  comment += `**Status:** ${status}\n`;
  comment += `**Overall Score:** ${overallScore.toFixed(1)}/${maxScore} ${passed ? '(Auto-merge threshold: ≥9.0)' : '(Below auto-merge threshold)'}\n\n`;
  comment += `### Summary\n${summary}\n\n`;

  // Question-by-question review
  if (questionReviews && questionReviews.length > 0) {
    comment += `### Question Reviews\n\n`;
    for (const review of questionReviews) {
      const qStatus = review.passed ? '✅' : '❌';
      comment += `${qStatus} **Question ${review.questionId}** - Score: ${review.score}/10\n`;
      if (review.issues && review.issues.length > 0) {
        comment += `  - **Issues:**\n`;
        review.issues.forEach(issue => comment += `    - ${issue}\n`);
      }
      if (review.comments) {
        comment += `  - ${review.comments}\n`;
      }
      comment += '\n';
    }
  }

  // Critical issues
  if (criticalIssues && criticalIssues.length > 0) {
    comment += `### 🚨 Critical Issues\n\n`;
    criticalIssues.forEach(issue => comment += `- ${issue}\n`);
    comment += '\n';
  }

  // Recommendations
  if (recommendations && recommendations.length > 0) {
    comment += `### 💡 Recommendations\n\n`;
    recommendations.forEach(rec => comment += `- ${rec}\n`);
    comment += '\n';
  }

  // Action taken
  if (passed) {
    comment += `---\n\n✨ **Action Taken:** This PR has been automatically merged after passing validation.\n\n`;
  } else {
    comment += `---\n\n⚠️ **Action Required:** This PR requires manual review due to validation issues. Please review the questions and address the issues above before merging.\n\n`;
  }

  comment += `*Reviewed by Claude API (claude-sonnet-4) on ${new Date().toISOString()}*`;

  // Post comment
  await octokit.issues.createComment({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: prNumber,
    body: comment
  });
}

async function approvePR(prNumber) {
  await octokit.pulls.createReview({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: prNumber,
    event: 'APPROVE',
    body: '✅ Automated review passed. All questions meet quality standards.'
  });
}

async function mergePR(prNumber) {
  await octokit.pulls.merge({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: prNumber,
    merge_method: 'squash',
    commit_title: '🤖 Auto-merge: Add validated orthopedic questions',
    commit_message: 'Questions validated by Claude API and automatically merged.\n\n🤖 Automated review and merge via GitHub Actions'
  });
}

async function assignPRForReview(prNumber) {
  // Add label
  await octokit.issues.addLabels({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: prNumber,
    labels: ['needs-manual-review', 'validation-failed']
  });

  // Assign to repository owner
  try {
    await octokit.issues.addAssignees({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      issue_number: prNumber,
      assignees: [REPO_OWNER]
    });
  } catch (error) {
    console.warn('   Could not assign PR (user may not have access)');
  }
}

async function commentOnPR(prNumber, message) {
  await octokit.issues.createComment({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: prNumber,
    body: message
  });
}

// Run main function
main();
