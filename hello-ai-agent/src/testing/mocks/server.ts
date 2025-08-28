import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';
import { initializeDb } from './db';

// Combine all handlers
export const handlers = [...authHandlers];

// Setup server for Node.js (testing)
export const server = setupServer(...handlers);

// Initialize database for testing
export const setupTestEnvironment = async () => {
  await initializeDb();
  server.listen();
};

export const cleanupTestEnvironment = () => {
  server.close();
};
