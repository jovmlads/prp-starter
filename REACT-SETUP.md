# React Project Setup Guide

This guide follows the bulletproof React architecture for creating scalable and maintainable React applications.

## Development Environment Requirements

- Windows PowerShell
- VS Code
- Node.js 18+
- Use PRPs-agentic-eng workspace
- Playwright for E2E testing

## Project Initialization

Initialize the project in the existing PRPs-agentic-eng workspace:

```powershell
# Create project using Vite
npm create vite@latest app -- --template react-ts
cd app

# Install core dependencies
npm install

# Install development and testing tools
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks prettier vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react @playwright/test

# Initialize Playwright
npx playwright install

# Install additional required dependencies
npm install @tanstack/react-query @hookform/resolvers zod react-hook-form @testing-library/react @testing-library/user-event vitest @vitejs/plugin-react eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs husky lint-staged msw shadcn-ui
```

## Project Structure

Create the following directory structure in the `src` folder:

```
src/
├── app/              # Application layer
│   ├── routes/       # Application routes
│   ├── app.tsx       # Main application component
│   └── provider.tsx  # Application providers
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Shared components
├── config/          # Global configurations
├── features/        # Feature-based modules
├── hooks/           # Shared hooks
├── lib/            # Reusable libraries
├── stores/         # Global state stores
├── testing/        # Test utilities
├── types/          # Shared types
└── utils/          # Shared utility functions
```

## Configuration Files

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "allowJs": false,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Node Configuration (tsconfig.node.json)

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "eslint.config.js"]
}
```

### ESLint Configuration (.eslintrc.cjs)

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react-hooks/recommended",
    "plugin:sonarjs/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["react-refresh", "@typescript-eslint", "sonarjs"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "no-console": ["error", { allow: ["warn", "error"] }],
    "sonarjs/cognitive-complexity": ["error", 15],
    "sonarjs/no-duplicate-string": ["error", 3],
    "check-file/filename-naming-convention": [
      "error",
      {
        "**/*.{ts,tsx}": "KEBAB_CASE",
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    "check-file/folder-naming-convention": [
      "error",
      {
        "src/**/!(__tests__)": "KEBAB_CASE",
      },
    ],
  },
};
```

### Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "jsxSingleQuote": true,
  "bracketSpacing": true
}
```

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "form-vendor": ["react-hook-form", "zod"],
        },
      },
    },
  },
});
```

### Vitest Configuration (vitest.config.ts)

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/testing/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Git Hooks with Husky

```powershell
# Initialize Husky
npm install husky --save-dev
npx husky init
```

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run type-check && npm run lint && npm run test
```

### Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint && npm run test:coverage && npm run test:e2e",
    "prepare": "cd .. && husky install app/.husky"
  }
}
```

## Quality Standards

1. **TypeScript**:

   - Strict mode enabled
   - No explicit `any` types
   - Explicit return types required
   - All external data validated with Zod

2. **Testing**:

   - Minimum 80% code coverage
   - Co-locate tests with components in `__tests__` folders
   - Use React Testing Library
   - Test behavior, not implementation

3. **Code Style**:

   - Files/folders in kebab-case
   - Components in PascalCase
   - Maximum 200 lines per component file
   - Maximum cognitive complexity of 15

4. **Documentation**:
   - JSDoc for all exported functions/components
   - File-level `@fileoverview` documentation
   - Prop documentation for components
   - Complex logic must be commented

## Vertical Slice Architecture

Each feature module should be self-contained in the `features` directory with its own:

```
src/features/feature-name/
├── api/         # API requests and hooks
├── assets/      # Feature-specific assets
├── components/  # Feature components
├── hooks/       # Feature-specific hooks
├── stores/      # Feature state management
├── types/       # Feature TypeScript types
└── utils/       # Feature utility functions
```

## Component Template

````typescript
/**
 * @fileoverview Example component following project standards
 * @module features/example/components/ExampleComponent
 */

import { ReactElement } from "react";
import { z } from "zod";

const exampleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
});

type ExampleData = z.infer<typeof exampleSchema>;

interface ExampleComponentProps {
  /** The data to display in the component */
  data: ExampleData;
  /** Callback when item is selected */
  onSelect: (id: string) => void;
}

/**
 * Example component demonstrating project standards.
 *
 * @component
 * @example
 * ```tsx
 * <ExampleComponent
 *   data={exampleData}
 *   onSelect={handleSelect}
 * />
 * ```
 */
export function ExampleComponent({
  data,
  onSelect,
}: ExampleComponentProps): ReactElement {
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2>{data.title}</h2>
      <button onClick={() => onSelect(data.id)}>Select</button>
    </div>
  );
}
````

## Getting Started

After setting up the project, you can:

1. Start development server:

```powershell
cd app
npm run dev
```

2. Run tests:

```powershell
npm test
```

3. Build for production:

```powershell
npm run build
```

4. Validate code:

```powershell
npm run validate
```
