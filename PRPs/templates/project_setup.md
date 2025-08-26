# Standard Project Setup Instructions

## PowerShell VS Code Commands (Windows)

Always use PowerShell commands in VS Code terminals for consistency across Windows environments.
All commands should be executed within the PRPs-agentic-eng workspace.

### Project Initialization

```powershell
# Initialize in current workspace (PRPs-agentic-eng)
npm create vite@latest app -- --template react-ts

# Install core dependencies
cd app
npm install

# Install development tools and testing frameworks
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks prettier vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react @playwright/test

# Initialize Playwright
npx playwright install
```

### E2E Testing Setup (Required)

```powershell
# Create e2e test directory and config
mkdir e2e
npm init playwright@latest

# Run Playwright tests
npm run test:e2e

# Open Playwright UI mode for development
npm run test:e2e -- --ui

# Update test snapshots if needed
npm run test:e2e -- -u
```

### Common VS Code PowerShell Commands

```powershell
# Start development server
npm run dev

# Install dependencies
npm install [package-name]

# Install dev dependencies
npm install -D [package-name]

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Styling Setup with Tailwind CSS (Recommended)

Tailwind CSS is recommended for this project because:

1. Zero-runtime CSS (styles are generated at build time)
2. Better performance compared to runtime CSS-in-JS solutions
3. Excellent TypeScript integration and IDE support
4. Built-in design system that's highly customizable
5. Seamless integration with modern component libraries

```powershell
# Install Tailwind CSS and its peer dependencies
npm install -D tailwindcss postcss autoprefixer

# Generate Tailwind and PostCSS config files
npx tailwindcss init -p
```

Configure your `tailwind.config.js`:

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

Add Tailwind directives to your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Important Notes

1. Always use npm over yarn for consistency
2. Keep package.json scripts consistent across projects
3. Use PowerShell-compatible commands (semicolons for multiple commands)
4. Consider using CSS Modules for components that require complex styling beyond utility classes
