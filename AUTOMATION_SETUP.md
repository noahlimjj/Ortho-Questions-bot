# Fully Automated Question Generation & Review System

This document explains how the **100% automated** daily question generation and weekly review system works.

---

## Overview

The system is **fully automated** with zero manual work required:

1. **Daily Generation** (2 AM UTC): Perplexity AI generates 10 new questions → Creates PR
2. **Weekly Review** (Sunday 3 AM UTC): Claude AI validates questions → Auto-merges if passing

### Question Domains (7-day rotation):

1. Trauma
2. Spine
3. Shoulder and Elbow
4. Wrist/Hand
5. Hip and Knee
6. Foot and Ankle
7. Orthopedic Emergencies

### Automation Stats:
- **Schedule**: Daily generation + Weekly auto-review
- **Manual Work**: Zero (100% automated)
- **Output**: ~70 validated questions/week auto-merged
- **Cost**: ~$0.45/month (Perplexity $0.15 + Claude $0.30)

---

## How It Works

### Architecture

#### Daily Question Generation (2 AM UTC)
```
GitHub Actions (daily-questions.yml)
    ↓
1. Generate 10 questions with Perplexity API
2. Validate CSV format
3. Rotate to next domain
4. Create Pull Request
```

#### Weekly Automated Review (Sunday 3 AM UTC)
```
GitHub Actions (weekly-review.yml)
    ↓
1. Find all open automated PRs
    ↓
2. Extract questions from PR diff
    ↓
3. Send to Claude API for validation
    ↓
4. Claude validates:
   - Medical accuracy (evidence-based)
   - 5 options per question
   - Clear correct answer
   - Quality explanations
   - No duplicates
    ↓
5. If score ≥ 9.0/10:
   ✅ Auto-approve + Auto-merge
   Questions go live immediately
    ↓
6. If score < 9.0/10:
   ⚠️ Add "needs-manual-review" label
   Assign to repository owner
   Post Claude's feedback as comment
```

### Files

**Generation:**
- **`.github/workflows/daily-questions.yml`**: Daily generation workflow
- **`scripts/generate-questions.js`**: Perplexity API integration
- **`scripts/domain-tracker.json`**: Domain rotation state
- **`QUESTION_BUILDER_PROMPT.md`**: Generation prompt template

**Review:**
- **`.github/workflows/weekly-review.yml`**: Weekly review workflow
- **`scripts/review-pr.js`**: Claude API integration + auto-merge logic
- **`scripts/claude-validator-prompt.md`**: Validation criteria for Claude

**Data:**
- **`ortho_questions.csv`**: Question database (auto-updated)

---

## Setup Instructions

### 1. Get API Keys

#### Perplexity API (for question generation)
1. Go to [Perplexity API Settings](https://www.perplexity.ai/settings/api)
2. Create an API key
3. Add credits ($3 minimum, lasts ~20 days at current usage)

#### Anthropic API (for Claude review)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add credits ($5 minimum, lasts ~16 weeks at current usage)

### 2. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add **two** repository secrets:

   **Secret 1:**
   - Name: `PERPLEXITY_API_KEY`
   - Value: Your Perplexity API key

   **Secret 2:**
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key

### 3. Enable GitHub Actions Permissions

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - Select **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### 4. Test the System

#### Test Question Generation:
1. Go to **Actions** tab in GitHub
2. Select **Generate Daily Orthopedic Questions**
3. Click **Run workflow** → **Run workflow**
4. Wait 2-3 minutes for completion
5. Check **Pull requests** tab for the generated PR

#### Test Automated Review:
1. Wait for a PR to be created (or create one manually)
2. Go to **Actions** tab
3. Select **Weekly PR Review with Claude**
4. Click **Run workflow** → **Run workflow**
5. Check PR for Claude's review comment
6. If score ≥ 9.0, PR will be auto-merged

#### Or Just Wait:
- **Daily generation** runs automatically at 2 AM UTC
- **Weekly review** runs automatically every Sunday at 3 AM UTC

---

## Automated Review Process

### What Happens Automatically:

Every Sunday at 3 AM UTC, Claude AI reviews all accumulated PRs:

1. **Fetches PRs**: Finds all open "automated" PRs from the past week
2. **Extracts Questions**: Reads the CSV diff from each PR
3. **Validates with Claude**: Sends questions to Claude API for comprehensive review
4. **Scores Each Question** (0-10):
   - Medical Accuracy (0-4 points) - Critical
   - Question Structure (0-2 points) - Critical
   - Correct Answer (0-2 points) - Critical
   - Explanation Quality (0-1 point)
   - Difficulty Level (0-1 point)
5. **Calculates Overall Score**: Average of all questions
6. **Auto-Merge Decision**:
   - **Score ≥ 9.0**: ✅ Auto-approve and merge immediately
   - **Score < 9.0**: ⚠️ Label as "needs-manual-review" and assign to you

### What You Need to Do:

**If everything goes well:** Nothing! Questions are auto-merged and go live.

**If validation fails:**
- You'll be assigned the PR
- Claude's feedback will be in PR comments
- Review Claude's concerns
- Fix issues or override if Claude is wrong
- Manually merge

**Time commitment**: ~0 minutes/week (only manual intervention if validation fails)

---

## Monitoring

### Check Workflow Status

1. Go to **Actions** tab
2. View recent workflow runs
3. Click on a run to see detailed logs

### Logs to Review

Each run shows:
- ✅ Questions generated successfully
- ⚠️ Any validation warnings
- 📊 Current statistics (total questions, domain rotation)

### Common Log Messages

```
🏥 Starting Orthopedic Questions Generator...
📊 Reading existing questions...
   Last question ID: 50
   Total questions: 50

🔄 Determining current domain...
   Current domain: Trauma (index 0)

🤖 Calling Perplexity API...
   Generated 10 questions

✅ Validating questions...
   10 questions passed validation

💾 Appending questions to CSV...
   10 questions added to ortho_questions.csv

✨ Success!
   Domain: Trauma
   Questions generated: 10
   New total: 60
   Next run: Spine
```

---

## Troubleshooting

### Issue: "PERPLEXITY_API_KEY environment variable is not set"

**Solution**:
1. Check that you added the secret in GitHub Settings
2. Verify the secret name is exactly `PERPLEXITY_API_KEY`
3. Re-run the workflow

### Issue: "No valid questions generated"

**Possible causes**:
- Perplexity API returned invalid format
- All questions failed validation
- API rate limit reached

**Solution**:
1. Check workflow logs for specific error
2. Verify API key has credits
3. Try manual run again

### Issue: "Pull request creation failed"

**Solution**:
1. Check that "Allow GitHub Actions to create pull requests" is enabled
2. Verify workflow has write permissions
3. Check if a PR with the same branch name exists

### Issue: Duplicate questions being generated

**Solution**:
1. The script checks last 20 questions for duplicates
2. If duplicates persist, edit `scripts/generate-questions.js`
3. Increase the `slice(-20)` to `slice(-50)` for more comprehensive checking

---

## Cost Management

### Current Costs

**Perplexity API Pricing** (llama-3.1-sonar-large-128k-online):
- Input: $1 per 1M tokens
- Output: $1 per 1M tokens
- Searches: $5 per 1,000 searches

**Per Generation** (~10 questions):
- Input tokens: ~2,000 ($0.002)
- Output tokens: ~3,000 ($0.003)
- Searches: 0 (disabled)
- **Total**: ~$0.005

**Monthly Cost**:
- 30 days × $0.005 = **~$0.15/month**

### Reducing Costs

1. **Use cheaper model**: Change model in `scripts/generate-questions.js`:
   ```javascript
   model: 'llama-3.1-sonar-small-128k-online' // $0.20 per 1M tokens
   ```

2. **Run less frequently**: Edit `.github/workflows/daily-questions.yml`:
   ```yaml
   cron: '0 2 * * 0,3' # Run only Sunday and Wednesday
   ```

3. **Generate fewer questions**: Edit `scripts/generate-questions.js`:
   ```javascript
   const QUESTIONS_PER_RUN = 5; // Instead of 10
   ```

---

## Customization

### Change Domain Rotation

Edit `scripts/domain-tracker.json`:

```json
{
  "currentDomainIndex": 0,
  "lastRunDate": "",
  "domains": [
    "Your Custom Domain 1",
    "Your Custom Domain 2",
    "Your Custom Domain 3"
  ]
}
```

### Change Schedule

Edit `.github/workflows/daily-questions.yml`:

```yaml
schedule:
  - cron: '0 14 * * *' # Run at 2 PM UTC instead
  - cron: '0 2 * * 1,4' # Run only Monday and Thursday at 2 AM UTC
```

### Change Questions Per Run

Edit `scripts/generate-questions.js`:

```javascript
const QUESTIONS_PER_RUN = 20; // Generate 20 questions instead of 10
```

### Change AI Model

Edit `scripts/generate-questions.js`:

```javascript
model: 'llama-3.1-sonar-huge-128k-online', // Different model
temperature: 0.5, // Higher creativity (0-1)
```

---

## Manual Generation (Local Testing)

You can test the script locally without waiting for GitHub Actions:

### Prerequisites
- Node.js 18+ installed
- Perplexity API key

### Steps

1. **Set environment variable**:
   ```bash
   export PERPLEXITY_API_KEY='your-api-key-here'
   ```

2. **Run the script**:
   ```bash
   npm run generate
   ```

3. **Check output**:
   ```bash
   tail -10 ortho_questions.csv
   ```

4. **Commit manually** (if satisfied):
   ```bash
   git add ortho_questions.csv scripts/domain-tracker.json
   git commit -m "Add manually generated questions"
   git push
   ```

---

## Pausing the Automation

### Temporary Pause

Disable the workflow:
1. Go to **Actions** tab
2. Select **Generate Daily Orthopedic Questions**
3. Click **•••** → **Disable workflow**

### Permanent Removal

Delete the workflow file:
```bash
rm .github/workflows/daily-questions.yml
git commit -m "Remove automated question generation"
git push
```

---

## Support

If you encounter issues:

1. **Check workflow logs** in Actions tab
2. **Review this documentation**
3. **Check Perplexity API status**: [status.perplexity.ai](https://status.perplexity.ai)
4. **Verify API credits** in Perplexity dashboard

---

## Security Notes

- ✅ API key is stored as GitHub Secret (encrypted)
- ✅ Never commit API keys to repository
- ✅ Workflow runs in isolated GitHub Actions environment
- ✅ Pull requests require manual approval before merging

---

## Future Enhancements

Potential improvements:
- [ ] Add difficulty level variation
- [ ] Generate questions based on user performance (weak topics)
- [ ] Add image generation for diagrams
- [ ] Implement question voting/rating system
- [ ] Auto-merge if all validations pass
- [ ] Slack/Email notifications for new PRs
