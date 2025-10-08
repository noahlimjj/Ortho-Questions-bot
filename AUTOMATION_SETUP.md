# Automated Question Generation Setup Guide

This document explains how the automated daily question generation system works and how to set it up.

---

## Overview

The system automatically generates 10 new orthopedic questions every day using Perplexity AI, rotating through 7 different domains:

1. Trauma
2. Spine
3. Shoulder and Elbow
4. Wrist/Hand
5. Hip and Knee
6. Foot and Ankle
7. Orthopedic Emergencies

**Schedule**: Daily at 2 AM UTC
**Output**: Pull Request with 10 new questions for weekly review
**Cost**: ~$0.06/month (Perplexity API)

---

## How It Works

### Architecture

```
GitHub Actions (Cron: 2 AM UTC daily)
    ↓
1. Checkout repository
    ↓
2. Read ortho_questions.csv (get last ID, existing questions)
    ↓
3. Read QUESTION_BUILDER_PROMPT.md (get prompt template)
    ↓
4. Read scripts/domain-tracker.json (get current domain)
    ↓
5. Build complete prompt with context
    ↓
6. Call Perplexity API
    ↓
7. Validate response (CSV format, 5 options, no duplicates)
    ↓
8. Append to ortho_questions.csv
    ↓
9. Update domain-tracker.json (rotate to next domain)
    ↓
10. Create Pull Request for review
```

### Files

- **`.github/workflows/daily-questions.yml`**: GitHub Actions workflow
- **`scripts/generate-questions.js`**: Main generation script
- **`scripts/domain-tracker.json`**: Tracks domain rotation
- **`QUESTION_BUILDER_PROMPT.md`**: Prompt template
- **`ortho_questions.csv`**: Question database

---

## Setup Instructions

### 1. Get Perplexity API Key

1. Go to [Perplexity API Settings](https://www.perplexity.ai/settings/api)
2. Create an API key
3. Add credits to your account ($3 minimum, lasts ~50 days)

### 2. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `PERPLEXITY_API_KEY`
5. Value: Your Perplexity API key
6. Click **Add secret**

### 3. Enable GitHub Actions Permissions

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - Select **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### 4. Test the Workflow

#### Option A: Manual Trigger (Recommended)
1. Go to **Actions** tab in GitHub
2. Select **Generate Daily Orthopedic Questions** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait 2-3 minutes for completion
5. Check the **Pull requests** tab for the generated PR

#### Option B: Wait for Scheduled Run
The workflow runs automatically at 2 AM UTC daily.

---

## Weekly Review Process

Every week (7 days), you'll have ~70 new questions to review:

### Steps:
1. **Check Pull Requests** tab on GitHub
2. **Open the latest auto-generated PR**
3. **Review the questions**:
   - Medical accuracy
   - 5 options per question (A-E)
   - No duplicates
   - Appropriate difficulty
4. **Use Claude Code for validation** (optional):
   - Pull the branch locally
   - Ask Claude Code to validate medical accuracy
   - Fix any issues
5. **Approve and merge** the PR
6. Questions automatically appear in your quiz app

**Time commitment**: ~15 minutes/week

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
