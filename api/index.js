// Vercel serverless entry point (Native ES Module JavaScript)
process.env.VERCEL = 'true';
process.env.UPLOADS_DIR = '/tmp';

// Import the Express app from the backend (TypeScript resolved as .js in bundler)
import app from '../backend/src/server.js';

export default app;
