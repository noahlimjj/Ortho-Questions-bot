# MCP Tools Guide for Ortho Questions Bot

## Available MCP Tools

This project can leverage Model Context Protocol (MCP) tools for various tasks.

### Browser Automation with Playwright MCP

For testing the web interface, you can use Playwright MCP tools if available.

#### Installation (if needed)

```bash
# Install Playwright MCP server
npm install -g @playwright/mcp-server

# Or use npx
npx @playwright/mcp-server
```

#### Usage for Testing

1. **Start the local server**:
```bash
cd "/Users/User/Desktop/Projects/Ortho Questions bot"
python3 -m http.server 8000
```

2. **Use Playwright MCP to test**:
- Navigate to http://localhost:8000
- Take screenshots
- Click elements
- Verify UI elements
- Test category filtering

#### Example Test Scenarios

**Test 1: Verify Category Dropdown Exists**
- Navigate to http://localhost:8000
- Find element with id "category-select"
- Verify it has 11 options (All + 9 categories + Uncategorized)

**Test 2: Test Category Selection**
- Select "Hand and Wrist" from dropdown
- Wait for quiz to reset
- Take screenshot
- Verify progress bar shows "Hand and Wrist"

**Test 3: Test Question Display**
- Click through a few questions
- Verify they all have Ch2_ prefix for Hand and Wrist
- Take screenshots of each step

**Test 4: Test Category Persistence**
- Select a category
- Refresh the page
- Verify category is still selected

### Alternative: Puppeteer MCP

If Playwright is not available, Puppeteer MCP can be used:

```bash
npm install -g @puppeteer/mcp-server
```

### Alternative: Simple HTTP Testing

For basic testing without browser automation:

```bash
# Test server is running
curl -I http://localhost:8000

# Test CSV loads
curl http://localhost:8000/ortho_questions.csv | head -20

# Test JavaScript loads
curl http://localhost:8000/script.js | head -20
```

### Python-based Testing

Create automated tests with Selenium or Playwright Python:

```bash
pip install playwright
playwright install chromium

# Then use Python scripts to test
```

---

## MCP Tool Recommendations

### For This Project:

1. **Playwright MCP** - Best for UI testing
   - Test category filtering
   - Verify question display
   - Screenshot testing
   - Click testing

2. **File System MCP** - For file operations
   - Read/write CSV files
   - Manage question imports
   - Backup data

3. **Git MCP** - For version control
   - Automated commits
   - PR creation
   - Branch management

4. **Web Search MCP** - For research
   - Find orthopedic information
   - Verify medical facts
   - Research new questions

---

## Testing Workflow with MCP

### Recommended Workflow:

1. **Start server**: `python3 -m http.server 8000`
2. **Use Playwright MCP** to:
   - Navigate to http://localhost:8000
   - Test all 9 categories
   - Verify filtering works
   - Take screenshots
   - Check for errors
3. **Review results**
4. **Make fixes if needed**
5. **Commit with Git MCP**

---

## Available MCP Servers

Check which MCP servers are available in your environment:

```bash
# List MCP servers (if using Claude Desktop)
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Or check MCP registry
mcp list
```

---

## Creating Custom MCP Tools

For project-specific automation, you can create custom MCP tools:

### Example: Question Validator MCP

```javascript
// question-validator-mcp.js
// Validates orthopedic questions for medical accuracy
// Can be integrated with AI models for fact-checking
```

### Example: CSV Manager MCP

```javascript
// csv-manager-mcp.js
// Manages question imports, exports, and formatting
// Ensures data integrity
```

---

## Future Enhancements

### Potential MCP Integrations:

1. **Medical Knowledge Base MCP**
   - Connect to UpToDate, PubMed
   - Verify medical facts
   - Generate evidence-based explanations

2. **Image Processing MCP**
   - Process X-ray images
   - Add radiology questions
   - Automated image optimization

3. **AI Question Generator MCP**
   - Generate new questions
   - Validate existing questions
   - Score question quality

4. **Analytics MCP**
   - Track user performance
   - Analyze difficulty levels
   - Generate reports

---

## Troubleshooting MCP Tools

### Common Issues:

**MCP tool not found**
- Ensure MCP server is installed
- Check MCP configuration
- Restart Claude Desktop

**Connection errors**
- Verify server is running
- Check port availability
- Review firewall settings

**Permission errors**
- Check file permissions
- Verify MCP server has access
- Review security settings

---

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Playwright Documentation](https://playwright.dev)
- [MCP Server List](https://github.com/modelcontextprotocol/servers)

---

**Note**: This guide assumes MCP tools are available in your environment. If not, you can still use traditional testing methods (manual browser testing, curl commands, Python scripts, etc.).
