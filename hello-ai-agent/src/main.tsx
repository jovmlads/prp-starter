import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.tsx';

// Initialize MSW in development
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { startMSW } = await import('./testing/mocks/browser');
  return startMSW();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
