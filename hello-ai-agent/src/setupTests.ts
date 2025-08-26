import '@testing-library/jest-dom';

// Mock ResizeObserver for chart components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
