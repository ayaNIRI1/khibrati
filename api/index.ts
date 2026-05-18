// Vercel serverless entry point
import path from 'path';

// Set environment variables for Vercel environment
process.env.VERCEL = 'true';
process.env.UPLOADS_DIR = '/tmp';

// Import the Express app from backend src
import app from '../backend/src/server';

export default app;
