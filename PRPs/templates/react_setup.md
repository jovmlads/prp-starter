# React Project Setup Template

> **📚 For complete setup instructions**, refer to the main [REACT-SETUP.md](../../REACT-SETUP.md) guide.
> This template provides the essential commands and configurations for quick reference.

This template follows the bulletproof React architecture for creating scalable and maintainable React applications.

## Quick Setup Commands

```powershell
# Create project using Vite
npm create vite@latest app -- --template react-ts
cd app

# Install all dependencies (comprehensive setup)
npm install

# Development dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs prettier vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react @playwright/test husky lint-staged

# Production dependencies
npm install @tanstack/react-query @hookform/resolvers zod react-hook-form msw

# Playwright E2E testing
npx playwright install

# Tailwind CSS setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
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

## Essential Project Structure

> **📚 For detailed structure explanation**, see [REACT-SETUP.md](../../REACT-SETUP.md#project-structure)

```
src/
├── app/              # Application layer
├── features/         # Feature-based modules (VERTICAL SLICE ARCHITECTURE)
├── components/       # Shared components
├── hooks/           # Shared hooks
├── lib/             # Reusable libraries
├── testing/         # Test utilities
├── types/           # Shared types
└── utils/           # Shared utility functions
```

## Essential Configuration Files

> **📚 For complete configuration details**, see [REACT-SETUP.md](../../REACT-SETUP.md#configuration-files)

Key files that will be auto-generated or need manual setup:

- `tsconfig.json` (TypeScript configuration)
- `vite.config.ts` (Vite configuration)
- `tailwind.config.js` (Tailwind CSS configuration)
- `.eslintrc.cjs` (ESLint configuration)
- `vitest.config.ts` (Testing configuration)

## Essential Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint && npm run test:coverage && npm run test:e2e"
  }
}
```

## Quality Standards Reference

> **📚 For complete quality standards**, see [REACT-SETUP.md](../../REACT-SETUP.md#quality-standards)

### Essential Standards:

- **TypeScript**: Strict mode, no `any`, explicit return types
- **Testing**: 80% minimum coverage, co-located tests
- **Code Style**: kebab-case files, PascalCase components, max 200 lines
- **Documentation**: JSDoc for all exported functions

## Vertical Slice Architecture

> **📚 For detailed architecture patterns**, see [REACT-SETUP.md](../../REACT-SETUP.md#vertical-slice-architecture)

Each feature should be self-contained:

```
src/features/feature-name/
├── api/         # API requests and hooks
├── components/  # Feature components
├── hooks/       # Feature-specific hooks
├── types/       # Feature TypeScript types
└── utils/       # Feature utility functions
```

## Quick Start

> **📚 For detailed getting started guide**, see [REACT-SETUP.md](../../REACT-SETUP.md#getting-started)

```powershell
# Start development
cd app && npm run dev

# Run all validations
npm run validate
```

---

**💡 This template is designed for quick reference. For comprehensive instructions, examples, and troubleshooting, always refer to the main [REACT-SETUP.md](../../REACT-SETUP.md) guide.**
