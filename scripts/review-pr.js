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

  // Step 4: Filter questions - keep only those with score >= 9.0
  console.log('   🔍 Filtering questions...');
  const { passingQuestions, failingQuestions } = await filterQuestions(pr.number, questions, validation);
  console.log(`   ✅ Passing questions: ${passingQuestions.length}`);
  console.log(`   ❌ Failing questions: ${failingQuestions.length}\n`);

  // Step 5: Update PR to remove failing questions
  if (failingQuestions.length > 0 && passingQuestions.length > 0) {
    console.log('   ✂️  Updating PR to remove failing questions...');
    await updatePRWithPassingQuestions(pr.number, passingQuestions);
    console.log('   ✅ PR updated with only passing questions\n');
  }

  // Step 6: Post results as comment
  console.log('   💬 Posting review comment...');
  await postReviewComment(pr.number, validation, passingQuestions.length, failingQuestions.length);

  // Step 7: Auto-merge if we have passing questions
  if (passingQuestions.length > 0) {
    console.log('   ✅ Found passing questions - Auto-merging...');
    // Wait a moment for the commit to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    await mergePR(pr.number, passingQuestions.length, failingQuestions.length);
    console.log('   🎉 PR merged successfully!');
  } else {
    console.log('   ⚠️  No passing questions - Closing PR...');
    await closePR(pr.number, 'All questions failed validation. No questions to merge.');
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

async function filterQuestions(prNumber, questions, validation) {
  const passingQuestions = [];
  const failingQuestions = [];

  // Get question reviews and filter by score
  if (validation.questionReviews && validation.questionReviews.length > 0) {
    validation.questionReviews.forEach((review, index) => {
      if (review.score >= 9.0) {
        passingQuestions.push(questions[index]);
      } else {
        failingQuestions.push(questions[index]);
      }
    });
  } else {
    // If no individual reviews, use overall score
    if (validation.overallScore >= 9.0) {
      passingQuestions.push(...questions);
    } else {
      failingQuestions.push(...questions);
    }
  }

  return { passingQuestions, failingQuestions };
}

async function updatePRWithPassingQuestions(prNumber, passingQuestions) {
  // Get the current branch for this PR
  const { data: pr } = await octokit.pulls.get({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: prNumber
  });

  const branch = pr.head.ref;

  // Get the current CSV file from main branch
  let mainCSV;
  try {
    const { data: mainFile } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: 'ortho_questions.csv',
      ref: 'main'
    });
    mainCSV = Buffer.from(mainFile.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error getting main CSV:', error.message);
    throw error;
  }

  // Append only passing questions
  const updatedCSV = mainCSV + passingQuestions.join('\n') + '\n';

  // Get the current file SHA from the PR branch
  const { data: branchFile } = await octokit.repos.getContent({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: 'ortho_questions.csv',
    ref: branch
  });

  // Update the file on the PR branch
  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: 'ortho_questions.csv',
    message: '🔍 Remove failing questions - keep only validated questions',
    content: Buffer.from(updatedCSV).toString('base64'),
    branch: branch,
    sha: branchFile.sha
  });
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

async function postReviewComment(prNumber, validation, passingCount, failingCount) {
  const { overallScore, maxScore, summary, questionReviews, criticalIssues, recommendations } = validation;

  const emoji = passingCount > 0 ? '🎉' : '⚠️';
  const totalQuestions = passingCount + failingCount;

  let comment = `## ${emoji} Automated Review Results\n\n`;
  comment += `**Questions Reviewed:** ${totalQuestions}\n`;
  comment += `**✅ Passing Questions:** ${passingCount} (score ≥ 9.0)\n`;
  comment += `**❌ Failing Questions:** ${failingCount} (score < 9.0)\n`;
  comment += `**Overall Score:** ${overallScore.toFixed(1)}/${maxScore}\n\n`;
  comment += `### Summary\n${summary}\n\n`;

  // Question-by-question review
  if (questionReviews && questionReviews.length > 0) {
    comment += `### Question Reviews\n\n`;
    for (const review of questionReviews) {
      const qStatus = review.score >= 9.0 ? '✅' : '❌';
      const action = review.score >= 9.0 ? 'KEPT' : 'REMOVED';
      comment += `${qStatus} **Question ${review.questionId}** - Score: ${review.score}/10 - **${action}**\n`;
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
    comment += `### 🚨 Critical Issues (Questions Removed)\n\n`;
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
  comment += `---\n\n`;
  if (passingCount > 0 && failingCount > 0) {
    comment += `✨ **Action Taken:** \n`;
    comment += `- Removed ${failingCount} question${failingCount !== 1 ? 's' : ''} with scores below 9.0\n`;
    comment += `- Kept ${passingCount} question${passingCount !== 1 ? 's' : ''} that passed validation\n`;
    comment += `- **PR automatically merged** with passing questions only\n\n`;
  } else if (passingCount > 0) {
    comment += `✨ **Action Taken:** All questions passed validation. PR automatically merged.\n\n`;
  } else {
    comment += `❌ **Action Taken:** All questions failed validation. PR will be closed.\n\n`;
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

async function mergePR(prNumber, passingCount, failingCount) {
  let commitMessage = 'Questions validated by Claude API and automatically merged.\n\n';
  commitMessage += `✅ ${passingCount} question${passingCount !== 1 ? 's' : ''} passed validation\n`;
  if (failingCount > 0) {
    commitMessage += `❌ ${failingCount} question${failingCount !== 1 ? 's' : ''} removed due to low scores\n\n`;
  }
  commitMessage += '🤖 Automated review and merge via GitHub Actions';

  await octokit.pulls.merge({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: prNumber,
    merge_method: 'squash',
    commit_title: `🤖 Auto-merge: Add ${passingCount} validated orthopedic question${passingCount !== 1 ? 's' : ''}`,
    commit_message: commitMessage
  });
}

async function closePR(prNumber, reason) {
  // Add comment explaining closure
  await octokit.issues.createComment({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: prNumber,
    body: `## 🚫 PR Closed\n\n${reason}\n\nNo questions were added to the database.`
  });

  // Close the PR
  await octokit.pulls.update({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: prNumber,
    state: 'closed'
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
