# React Development Guide

This document provides guidance for React development in this repository, following the bulletproof React architecture and best practices.

## Setup Guides

The following guides provide comprehensive React project setup instructions:

1. **Quick Reference**: `REACT-SETUP.md` in the repository root
2. **Authoritative Version**: `PRPs/templates/react_setup.md`

These guides should be followed exactly when:

- Creating new React projects
- Setting up development environments
- Configuring tools and linters
- Structuring components and features

## Project Structure

All React projects MUST follow the vertical slice architecture:

```
src/
├── app/              # Application layer
│   ├── routes/       # Application routes
│   ├── app.tsx       # Main application component
│   └── provider.tsx  # Application providers
├── assets/          # Static assets
├── components/      # Shared components
├── config/         # Global configurations
├── features/       # Feature-based modules
├── hooks/          # Shared hooks
├── lib/            # Reusable libraries
├── stores/         # Global state stores
├── testing/        # Test utilities
├── types/          # Shared types
└── utils/          # Shared utility functions
```

## Quality Standards

1. **TypeScript**:

   - Strict mode required
   - No explicit `any`
   - Explicit return types
   - Zod validation for all external data

2. **Testing**:

   - 80% minimum coverage
   - Co-located tests in `__tests__`
   - React Testing Library
   - Test behavior, not implementation

3. **Code Style**:
   - Files/folders in kebab-case
   - Components in PascalCase
   - Max 200 lines per component
   - Max cognitive complexity 15

## Feature Module Structure

Each feature module should be structured as:

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

## Essential Tools & Configurations

1. **Build Tool**: Vite with React plugin
2. **Styling**: CSS Modules
3. **State Management**: React Query for server state
4. **Form Handling**: React Hook Form with Zod
5. **Testing**: Vitest + React Testing Library
6. **Linting**: ESLint with TypeScript and SonarJS

## Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:coverage # Check coverage
npm run test:e2e     # E2E tests

# Quality
npm run lint         # Run ESLint
npm run type-check   # Check types
npm run validate     # Run all checks
```

## Component Template

````typescript
/**
 * @fileoverview Example feature component following project standards
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

## Best Practices

1. **Component Development**

   - One component per file
   - Proper TypeScript interfaces
   - JSDoc documentation
   - Handle all states
   - Use proper error boundaries

2. **State Management**

   - Local state for UI
   - React Query for server state
   - Context for feature state
   - URL for shareable state

3. **Performance**

   - Use React 19 compiler
   - Implement code splitting
   - Lazy load components
   - Optimize bundle size

4. **Security**
   - Validate all inputs
   - Sanitize user content
   - Implement CSP
   - Secure API calls

## Additional Resources

- React 19 Documentation
- TypeScript Handbook
- Testing Library Guides
- Vite Documentation
- ESLint Rules Reference
