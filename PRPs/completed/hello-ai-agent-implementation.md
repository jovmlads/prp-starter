# Hello AI Agent - Implementation Guide 🚀

## Overview

This document provides step-by-step instructions for implementing the Hello AI Agent single-page React application based on the specifications in `hello-ai-agent-prd.md`.

## Implementation Steps

### Step 1: Project Setup

**Create new Vite project:**

```bash
npm create vite@latest hello-ai-agent -- --template react-ts
cd hello-ai-agent
npm install
```

**Configure ESLint and Prettier:**

Create `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-refresh"],
  "root": true,
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ]
  }
}
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

**Install development dependencies:**

```bash
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react-refresh prettier vitest @testing-library/react \
  @testing-library/jest-dom
```

### Step 2: Project Structure

Create the following directory structure:

```
src/
├── App.tsx            # Main application component
├── main.tsx          # Entry point
├── styles/           # Styling directory
│   └── App.css      # Application styles
├── vite-env.d.ts    # Type declarations
└── __tests__/       # Test directory
    └── App.test.tsx # App component tests
```

### Step 3: Implementation Files

**src/styles/App.css:**

```css
.app-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.title {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
    padding: 0.5rem;
  }
}
```

**src/App.tsx:**

```typescript
import "./styles/App.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="title">Hello AI Agent</h1>
    </div>
  );
}

export default App;
```

**src/main.tsx:**

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**src/**tests**/App.test.tsx:**

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  it("renders the title correctly", () => {
    render(<App />);
    const titleElement = screen.getByText(/Hello AI Agent/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    render(<App />);
    expect(document.querySelector(".app-container")).toBeInTheDocument();
    expect(document.querySelector(".title")).toBeInTheDocument();
  });
});
```

### Step 4: Configuration Updates

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
  },
});
```

Create `src/setupTests.ts`:

```typescript
import "@testing-library/jest-dom";
```

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "format": "prettier --write ."
  }
}
```

### Step 5: Quality Checks

Before considering the implementation complete, verify:

1. **Type Safety:**

```bash
npm run build
```

2. **Linting:**

```bash
npm run lint
```

3. **Tests:**

```bash
npm run test
```

4. **Format Check:**

```bash
npm run format
```

### Step 6: Development Server

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to see the application running.

## Validation Checklist

- [ ] Application displays "Hello AI Agent" title
- [ ] Styling is applied correctly
- [ ] Responsive design works on different screen sizes
- [ ] All tests are passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code is properly formatted
- [ ] Application loads quickly
- [ ] No console errors

## Troubleshooting

Common issues and solutions:

1. **TypeScript errors:**

   - Ensure strict mode is enabled in tsconfig.json
   - Check for proper type definitions

2. **Test failures:**

   - Verify test environment setup
   - Check for proper DOM queries
   - Ensure components are properly rendered

3. **Development server issues:**
   - Clear node_modules and reinstall dependencies
   - Check for port conflicts
   - Verify Vite configuration

## Next Steps

After successful implementation:

1. Consider adding:

   - Animation for title appearance
   - Theme switching capability
   - Additional interactive elements

2. Performance optimization:

   - Analyze bundle size
   - Implement lazy loading if needed
   - Add performance monitoring

3. Documentation:
   - Update README.md
   - Add JSDoc comments
   - Document any custom configurations
