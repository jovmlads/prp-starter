import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { initializeDb } from './db';

// Combine all handlers
export const handlers = [...authHandlers];

// Setup worker for browser
export const worker = setupWorker(...handlers);

// Initialize database on worker start
export const startMSW = async () => {
  await initializeDb();

  if (process.env.NODE_ENV === 'development') {
    await worker.start({
      onUnhandledRequest: (request, print) => {
        // Bypass Supabase requests - let them go through to real API
        if (request.url.includes('supabase.co')) {
          return;
        }

        // Warn about other unhandled requests
        print.warning();
      },
    });
  }
};
