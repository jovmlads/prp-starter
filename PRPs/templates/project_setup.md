# Standard Project Setup Instructions

## PowerShell VS Code Commands

Always use PowerShell commands in VS Code terminals for consistency across Windows environments.

### Project Initialization

```powershell
# Create new Vite project with React and TypeScript
npm create vite@latest app -- --template react-ts
cd app
npm install
```

### Tailwind CSS Setup (Standard Method)

1. Install Tailwind CSS and its peer dependencies:

```powershell
npm install -D tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14
```

2. Create Tailwind CSS configuration:

```powershell
npx tailwindcss init -p
```

3. Configure your `tailwind.config.js`:

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

4. Configure your `postcss.config.js`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

5. Add Tailwind directives to your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
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

### Important Notes

1. Always use npm over yarn for consistency
2. Use specific versions for Tailwind CSS and its dependencies to avoid compatibility issues
3. Keep package.json scripts consistent across projects
4. Use PowerShell-compatible commands (semicolons for multiple commands)
