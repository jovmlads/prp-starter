# React Development Reference Guide

> **📚 MAIN SETUP GUIDE**: [REACT-SETUP.md](../../REACT-SETUP.md) - Complete setup instructions  
> **🤖 CLAUDE GUIDELINES**: [claude_md_files/CLAUDE-REACT.md](../../claude_md_files/CLAUDE-REACT.md) - AI assistant patterns  
> **📋 TEMPLATE**: [templates/react_setup.md](../templates/react_setup.md) - Quick reference template

This document provides high-level guidance for React development in this repository, following the bulletproof React architecture and best practices.

## Setup Guide Hierarchy

1. **[REACT-SETUP.md](../../REACT-SETUP.md)** - **AUTHORITATIVE** comprehensive setup guide
2. **[templates/react_setup.md](../templates/react_setup.md)** - Quick reference template
3. **[claude_md_files/CLAUDE-REACT.md](../../claude_md_files/CLAUDE-REACT.md)** - Claude-specific development patterns
4. **[templates/prp_poc_react.md](../templates/prp_poc_react.md)** - POC-specific template

## Quick Command Reference

> **📚 For complete commands and explanations**, see [REACT-SETUP.md](../../REACT-SETUP.md#project-initialization)

```powershell
# Essential setup
npm create vite@latest app -- --template react-ts
cd app && npm install

# Development workflow
npm run dev          # Start development server
npm run validate     # Run all quality checks
npm run test:e2e     # Run end-to-end tests
```

## Architecture Overview

> **📚 For detailed architecture guidance**, see [REACT-SETUP.md](../../REACT-SETUP.md#vertical-slice-architecture)

**MANDATORY**: All React projects MUST follow vertical slice architecture:

- **Features over layers** - organize by business capabilities
- **Co-located tests** - tests live with the code they test
- **Self-contained modules** - each feature has its own components, hooks, types
- **Shared utilities** - common code in shared directories

## Quality Standards Summary

> **📚 For complete quality standards**, see [REACT-SETUP.md](../../REACT-SETUP.md#quality-standards)

1. **TypeScript**: Strict mode, no `any`, explicit return types
2. **Testing**: 80% minimum coverage, React Testing Library
3. **Code Style**: kebab-case files, PascalCase components, max 200 lines
4. **Documentation**: JSDoc for all exports, component prop documentation

## MCP Integration (MANDATORY)

> **📚 For complete MCP setup**, see [REACT-SETUP.md](../../REACT-SETUP.md#mcp-server-setup-for-ui-libraries)

**CRITICAL**: Always use official MCP servers for React libraries:

- **shadcn/ui**: `npx shadcn@latest mcp init --client claude`
- **Material-UI**: `claude mcp add mui-mcp -- npx -y @mui/mcp@latest`
- **Discovery pattern**: Check for `@[library-name]/mcp` packages

## Development Commands

> **📚 For complete command explanations**, see [REACT-SETUP.md](../../REACT-SETUP.md#getting-started)

```bash
# Quality assurance
npm run lint         # ESLint with zero warnings
npm run type-check   # TypeScript validation
npm run test:coverage # 80% minimum coverage
npm run validate     # All checks combined
```

## Key Patterns Reference

> **📚 For complete patterns and examples**, see [claude_md_files/CLAUDE-REACT.md](../../claude_md_files/CLAUDE-REACT.md)

### Component Development

- Use `ReactElement` return type (not `JSX.Element`)
- Implement proper error boundaries for feature modules
- Handle ALL states: loading, error, empty, success
- Co-locate tests with components in `__tests__` folders

### State Management Hierarchy

1. **Local State**: `useState` for component-specific state
2. **Server State**: TanStack Query for ALL API data (mandatory)
3. **Context**: For cross-component state within features
4. **URL State**: Search params for shareable state

### Data Validation (MANDATORY)

- **ALL external data** must be validated with Zod schemas
- Use branded types for IDs and domain-specific values
- Validate at system boundaries, fail fast
- Never trust external data without validation

## Additional Resources

- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library Guides](https://testing-library.com/docs/)
- [Vite Documentation](https://vitejs.dev)

---

**💡 This reference guide provides overview and quick access. For detailed instructions, examples, and complete setup procedures, always refer to the main [REACT-SETUP.md](../../REACT-SETUP.md) guide.**
