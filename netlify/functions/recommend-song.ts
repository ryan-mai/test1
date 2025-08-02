import { Handler } from '@netlify/functions';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export const handler: Handler = async (event) => {
  // Ensure this is a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  
  try {
    const body = JSON.parse(event.body || '{}');
    const bpm = body.bpm || 120; // Default to 120 BPM if not provided
    
    // Get absolute path to the Python script
    const scriptPath = path.resolve(process.cwd(), 'test.py');
    
    // Execute the Python script
    const { stdout, stderr } = await execPromise(`python ${scriptPath} ${bpm}`);
    
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
    }
    
    try {
      // Parse the JSON output from the Python script
      const result = JSON.parse(stdout);
      
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to parse Python output',
          output: stdout
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message || 'Unknown error occurred' 
      }),
    };
  }
};
