const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    // Validate required environment variables
    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      throw new Error('Missing required environment variables: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_SHEET_ID');
    }

    // Create JWT auth client
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch all data from Sheet1
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet1',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      throw new Error('No data found in the spreadsheet');
    }

    // Extract headers and data rows
    const headers = rows[0];
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
      throw new Error('No question data found (only headers present)');
    }

    // Convert rows to JSON objects
    const questions = dataRows.map(row => {
      const questionObj = {};
      headers.forEach((header, index) => {
        questionObj[header] = row[index] || '';
      });
      return questionObj;
    });

    // Handle query parameters
    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    const count = parseInt(queryParams.get('count')) || 1;
    const excludeIds = queryParams.get('exclude') ? queryParams.get('exclude').split(',').map(Number) : [];

    // Filter out excluded questions
    const availableQuestions = questions.filter(q => {
      const id = parseInt(headers.indexOf('ID') !== -1 ? q[headers.indexOf('ID')] : q[0]);
      return !excludeIds.includes(id);
    });

    if (availableQuestions.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'No more questions available' })
      };
    }

    // Shuffle and select requested number of questions
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(count, availableQuestions.length));

    // Return success response with CORS headers
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(count === 1 ? selectedQuestions[0] : selectedQuestions)
    };

  } catch (error) {
    console.error('Error in getQuestion function:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to fetch question',
        message: error.message
      })
    };
  }
};