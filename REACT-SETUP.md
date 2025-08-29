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
Set-Location app

# Install core dependencies
npm install

# Install development dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs prettier vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react @playwright/test husky lint-staged

# Initialize Playwright for E2E testing
npx playwright install

# Install production dependencies
npm install @tanstack/react-query @hookform/resolvers zod react-hook-form msw

# Install and configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create styles directory and globals.css
New-Item -ItemType Directory -Path "src/styles" -Force
@"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@ | Out-File -FilePath "src/styles/globals.css" -Encoding UTF8

# Update main.tsx to import global styles
$mainTsxPath = "src/main.tsx"
if (Test-Path $mainTsxPath) {
    $content = Get-Content $mainTsxPath -Raw
    if (!($content -match "import './styles/globals.css'")) {
        $newContent = "import './styles/globals.css'`n" + $content
        $newContent | Out-File -FilePath $mainTsxPath -Encoding UTF8
    }
}
```

## MCP Server Setup for UI Libraries

**CRITICAL**: For every React library you use, check if there's an official MCP (Model Context Protocol) server available. MCP servers provide AI assistants with direct access to official documentation, components, and best practices.

### Required MCP Servers for React Development

#### shadcn/ui MCP Server (MANDATORY)

```powershell
# Initialize shadcn MCP server for Claude Code
npx shadcn@latest mcp init --client claude

# Or add manually to .mcp.json
@"
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
"@ | Out-File -FilePath ".mcp.json" -Encoding UTF8
```

#### Material-UI (MUI) MCP Server (MANDATORY)

```powershell
# Add MUI MCP server for Claude Code
claude mcp add mui-mcp -- npx -y @mui/mcp@latest

# Or add manually to .mcp.json
@"
{
  "mcpServers": {
    "mui-mcp": {
      "command": "npx",
      "args": ["-y", "@mui/mcp@latest"]
    }
  }
}
"@ | Out-File -FilePath ".mcp.json" -Encoding UTF8
```

#### MCP Server Discovery Pattern (MANDATORY)

**For every React library you add to your project, follow this pattern:**

1. **Check official MCP server availability**:

   ```powershell
   # Search for official MCP server documentation
   # Check library's official docs for MCP section
   # Look for @[library-name]/mcp packages on npm
   ```

2. **Priority order for MCP servers**:

   - Official library MCP servers (highest priority)
   - Community-maintained MCP servers (verify quality)
   - Generic documentation MCP servers (lowest priority)

3. **Add to project configuration**:
   ```powershell
   # Example for any React library with MCP support
   claude mcp add [library-name]-mcp -- npx -y @[library-name]/mcp@latest
   ```

### MCP Configuration Validation

```powershell
# Verify MCP servers are working
npx @modelcontextprotocol/inspector

# Check connection in Claude Code
# Run: /mcp
# Verify all servers show "Connected" status
```

### Example MCP Usage Prompts

Once MCP servers are configured, use these patterns:

**shadcn/ui**:

- "Show me all available components in the shadcn registry"
- "Add the button, dialog and card components to my project"
- "Create a contact form using components from the shadcn registry"

**Material-UI**:

- "Show me the latest MUI component examples for data tables"
- "Help me implement a responsive navigation using MUI components"
- "What are the best practices for theming with MUI v6?"

**General Pattern**:

- "Use the [library-name] MCP server to show me [specific functionality]"
- "Fetch the official documentation for [component-name] from [library-name]"

## Project Structure

Create the following directory structure in the `src` folder:

```
app/                  # React application root (MANDATORY location)
├── src/              # Source code directory
│   ├── app/          # Application layer
│   │   ├── routes/   # Application routes
│   │   ├── app.tsx   # Main application component
│   │   └── provider.tsx  # Application providers
│   ├── assets/       # Static assets (images, fonts, etc.)
│   ├── components/   # Shared components
│   ├── config/       # Global configurations
│   ├── features/     # Feature-based modules
│   ├── hooks/        # Shared hooks
│   ├── lib/          # Reusable libraries
│   ├── stores/       # Global state stores
│   ├── testing/      # Test utilities
│   ├── types/        # Shared types
│   └── utils/        # Shared utility functions
├── docs/             # MANDATORY: Project documentation
│   ├── feature-{name}-documentation.md  # Individual feature docs
│   ├── epic-{name}-documentation.md     # Epic-level documentation
│   ├── api-integration.md               # API integration patterns
│   ├── testing-guide.md                 # Testing approach and examples
│   └── README.md                        # Documentation index
├── public/           # Static assets
├── tests/            # E2E and integration tests
└── package.json      # Project configuration
```

### Documentation Standards (MANDATORY)

#### docs/ Folder Requirements

**CRITICAL**: Every completed feature, epic, or task MUST have corresponding documentation in the `docs/` folder.

**Documentation File Structure:**

```
docs/
├── README.md                            # Navigation and project overview
├── feature-{name}-documentation.md      # Per-feature documentation
├── epic-{name}-documentation.md         # Epic-level documentation
├── api-integration.md                   # External API usage patterns
├── testing-guide.md                     # Testing approach and examples
├── component-library.md                 # Reusable component documentation
└── troubleshooting.md                   # Common issues and solutions
```

**Documentation Template for Features:**

```markdown
# {Feature Name} Documentation

## Overview
Brief description of the feature and its business value.

## Components Created/Modified
List of React components with usage examples.

## API Integration
External APIs used, data flow patterns, error handling.

## Testing Coverage
Test types implemented, coverage summary, testing patterns.

## Dependencies
External libraries added, configuration details.

## Usage Examples
Code snippets showing how to use the feature.

## Troubleshooting
Common issues and their solutions.
```

## Configuration Files

### Generated Configuration Files

After running `npx tailwindcss init -p`, you'll have two new files:

#### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

The setup will also create:

#### src/styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This CSS file needs to be imported in your entry file (src/main.tsx). The setup script will add this import automatically:

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
# Initialize Husky for git hooks
npm install husky --save-dev
npx husky init

# Create pre-commit hook
$preCommitPath = ".husky/pre-commit"
@"
#!/usr/bin/env pwsh
. "`$(Split-Path `$MyInvocation.MyCommand.Path)/_/husky.ps1"

npm run type-check
if (`$LASTEXITCODE -eq 0) { npm run lint }
if (`$LASTEXITCODE -eq 0) { npm run test }
"@ | Out-File -FilePath $preCommitPath -Encoding UTF8
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
    "prepare": "Set-Location ..; husky install app/.husky"
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
Set-Location app
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
