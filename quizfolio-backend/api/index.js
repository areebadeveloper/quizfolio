// api/index.js
// This file serves as the entry point for Vercel serverless functions

// Enable better error handling for async functions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at here:', promise, 'reason:', reason);
  // Application specific handling code here
});

// Import the Express app from server.js
const app = require('../server');

// Export the Express API as the default function
module.exports = app; 