// Vercel serverless entry point (TypeScript Compiler-Proof)
declare const process: any;

// Set environment variables for Vercel environment
process.env.VERCEL = 'true';
process.env.UPLOADS_DIR = '/tmp';

// Import the Express app from backend src (using .js extension as strictly required by ES Modules in TS)
import app from '../backend/src/server.js';

export default app;
