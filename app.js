'use strict';

// Start NestJS app
require('./dist/main');  // this already bootstraps your server

// Catch unhandled errors globally
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});