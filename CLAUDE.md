# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Nature

This i### Component Best Practices

1. **General Guidelines**

   - Maximum 200 lines per component
   - Single responsibility principle
   - Comprehensive JSDoc documentation
   - Strict TypeScript typing
   - Proper error boundaries
   - Handle all states (loading, error, empty, success)

2. **MUI Implementation**

   ```typescript
   /**
    * Custom button component with MUI implementation
    */
   import { Button, styled } from "@mui/material";

   const StyledButton = styled(Button)(({ theme }) => ({
     borderRadius: theme.shape.borderRadius,
     padding: theme.spacing(1, 3),
   }));

   interface CustomButtonProps {
     // props definition
   }

   export const CustomButton: React.FC<CustomButtonProps> = (props) => {
     return <StyledButton {...props} />;
   };
   ```

3. **AG Grid Implementation**

   ```typescript
   /**
    * Data grid component with AG Grid implementation
    */
   import { AgGridReact } from "ag-grid-react";
   import "ag-grid-enterprise";
   import "ag-grid-community/styles/ag-grid.css";
   import "ag-grid-community/styles/ag-theme-material.css";

   interface DataGridProps<T> {
     data: T[];
     columnDefs: ColDef[];
   }

   export const DataGrid = <T>({ data, columnDefs }: DataGridProps<T>) => {
     return (
       <div className="ag-theme-material">
         <AgGridReact
           rowData={data}
           columnDefs={columnDefs}
           pagination={true}
           defaultColDef={{
             sortable: true,
             filter: true,
             resizable: true,
           }}
         />
       </div>
     );
   };
   ```

4. **AG Charts Implementation**

   ```typescript
   /**
    * Chart component with AG Charts implementation
    */
   import { AgChartsReact } from 'ag-charts-react';

   interface ChartProps {
     data: ChartData[];
     options?: AgChartOptions;
   }

   export const Chart: React.FC<ChartProps> = ({ data, options }) => {
     const chartOptions: AgChartOptions = {
       data,
       theme: 'material',
       ...options,
     };

     return <AgChartsReact options={chartOptions} />;
   };RP (Product Requirement Prompt) Framework** repository for React frontend development. The core concept: **"PRP = PRD + curated codebase intelligence + agent/runbook"** - designed to enable AI agents to ship production-ready React code on the first pass using Claude Sonnet 3.5 and RAG-enhanced development practices.
   ```

## Workspace Configuration

### Project Location

All React projects MUST be created in the `app` directory at the root of this repository:

```
PRPs-agentic-eng/
├── app/                # React application root
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── tests/         # Test files
│   └── package.json   # Project dependencies
└── ... other repo files
```

### Workspace Usage

- **Use this workspace** for all development activities
- **Maintain existing workspace** structure and configuration
- **Develop within** the established repository structure
- **Place React files** in the `app` directory
- **Preserve** repository context and documentation

## Core Architecture

### Package Management Guidelines

- **Use npm**: Maintain consistency with clean npm installs
- **Use standard installation**: Prefer default npm install commands
- **Follow version requirements**:
  - Node.js >= 18.0.0
  - npm >= 9.0.0
  - React >= 19.0.0
  - TypeScript >= 5.0.0
  - Vite >= 5.0.0

### Dependencies Structure

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-query": "^5.0.0",
    "zod": "^3.22.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "ag-grid-react": "^31.0.0",
    "ag-grid-community": "^31.0.0",
    "ag-grid-enterprise": "^31.0.0",
    "ag-charts-react": "^9.0.0",
    "ag-charts-community": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### Command-Driven Development

All development commands must be run through npm scripts:

````json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test && npm run test:e2e",
    "preview": "vite preview",
    "review": "npm run lint && npm run test:all"
  }
}

### React Development Philosophy

- **KISS (Keep It Simple, Stupid)**: Choose straightforward solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Implement features only when needed
- **Component-First Architecture**: Build reusable, composable components with single responsibilities
- **Performance by Default**: Let React 19's compiler handle optimizations
- **Validation-First Design**: Validate all inputs with Zod, fail fast

### Component Architecture

1. **Structure and Organization**
   ```text
   src/
   ├── features/              # Feature-based modules
   │   └── [feature]/
   │       ├── __tests__/     # Co-located tests
   │       ├── components/    # Feature components
   │       ├── hooks/         # Feature-specific hooks
   │       ├── api/          # API integration
   │       ├── schemas/      # Zod validation
   │       └── types/        # TypeScript types
   ├── shared/
   │   ├── components/       # Shared UI components
   │   │   ├── mui/         # MUI component wrappers
   │   │   ├── grids/       # AG Grid components
   │   │   └── charts/      # AG Charts components
   │   ├── hooks/           # Shared hooks
   │   └── utils/           # Helper functions
   ├── theme/
   │   ├── mui/             # MUI theme customization
   │   └── ag-grid/         # AG Grid theme settings
   └── styles/              # Global styles

2. **UI Component Standards**
   - Use Material-UI (MUI) for all base components
   - Maintain consistent theming through MUI theme provider
   - Create reusable MUI component wrappers
   - Follow MUI's styling patterns using styled components

3. **Data Grid Standards**
   - Use AG Grid for all table/grid implementations
   - Implement server-side sorting and filtering
   - Use AG Grid's built-in TypeScript interfaces
   - Maintain consistent grid styling across features

4. **Charting Standards**
   - Use AG Charts for all data visualizations
   - Implement responsive chart layouts
   - Follow consistent color schemes
   - Use TypeScript for chart configurations
   ```

2. **Component Best Practices**
   - Maximum 200 lines per component
   - Single responsibility principle
   - Comprehensive JSDoc documentation
   - Strict TypeScript typing
   - Proper error boundaries
   - Handle all states (loading, error, empty, success)

3. **Styling Architecture**
   - Use CSS modules for component styles
   - Implement responsive design with media queries
   - Follow mobile-first approach
   - Maintain global theme variables
   - Use CSS Grid and Flexbox effectively

### CSS Architecture

```text
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── Button.test.tsx
│   └── Card/
│       ├── Card.tsx
│       ├── Card.module.css
│       └── Card.test.tsx
├── styles/
│   ├── variables.css      # CSS variables
│   ├── breakpoints.css    # Media query breakpoints
│   └── global.css        # Global styles
└── theme/
    └── mediaQueries.ts   # TypeScript media query helpers
````

### Media Query Guidelines

````css
/* breakpoints.css */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Component.module.css */
.component {
  /* Mobile first approach */
  padding: 1rem;

  /* Tablet and up */
  @media (min-width: 768px) {
    padding: 2rem;
  }

  /* Desktop and up */
  @media (min-width: 1024px) {
    padding: 3rem;
  }
}

### AI Development Configuration

#### Claude Sonnet 3.5 Setup

- **Model**: Always use Claude Sonnet 3.5 for enhanced coding capabilities
- **Context Window**: 200k tokens for comprehensive codebase understanding
- **Temperature**: 0.7 for balanced creativity and precision
- **RAG Integration**: Automatic retrieval from curated React documentation

#### RAG-Enhanced Development

- **Documentation Sources**:
  - React 19 official documentation
  - Vite documentation
  - TypeScript handbook
  - Best practices and patterns
  - Security guidelines

- **Code Generation Workflow**:
  1. RAG retrieval from documentation
  2. Context analysis
  3. Component/feature implementation
  4. Test generation
  5. Documentation updates

#### AI Documentation Structure

- `PRPs/ai_docs/` - Curated React/TypeScript documentation for RAG
- `claude_md_files/CLAUDE-REACT.md` - React-specific guidelines and patterns
- `templates/` - Component and feature templates with RAG context

## Development Commands

### React Project Setup

For detailed React project setup instructions, refer to these guides:
- `REACT-SETUP.md` in the repository root
- `PRPs/templates/react_setup.md` for the authoritative version

These guides contain comprehensive instructions for:
- Project initialization with Vite
- Full directory structure following vertical slice architecture
- Complete configuration files (TypeScript, ESLint, etc.)
- Testing setup with Vitest
- Quality standards and coding guidelines
- Component templates and examples

> **CRITICAL**: Always follow these setup guides when creating new React projects to ensure consistency and best practices across the codebase.`

### PRP Execution with RAG

```powershell
# Interactive mode (recommended for development)
npm run dev:rag

# Production build with RAG optimizations
npm run build:rag

# Test with RAG context
npm run test:rag
```

### Key Claude Commands

- `/prp-base-create` - Generate comprehensive PRPs with research
- `/prp-base-execute` - Execute PRPs against codebase
- `/prp-planning-create` - Create planning documents with diagrams
- `/prime-core` - Prime Claude with project context
- `/review-staged-unstaged` - Review git changes using PRP methodology

## Success Guidelines

### The PRP Methodology

1. **Embrace Complete Context**: Include comprehensive documentation, examples, and insights
2. **Build Strong Validation**: Implement thorough tests and linting for quality assurance
3. **Create Rich Information**: Use meaningful keywords and established patterns
4. **Follow Iterative Success**: Begin with core features, validate, and enhance systematically

### Development Excellence

1. **Write Clean Code**
   - Use descriptive variable names
   - Keep functions focused and concise
   - Structure code for readability

2. **Ensure Type Safety**
   - Use TypeScript's type system effectively
   - Implement proper interfaces and types
   - Leverage type inference where beneficial

3. **Build Robust Components**
   - Create reusable, focused components
   - Implement proper error boundaries
   - Follow accessibility guidelines

4. **Maintain Quality**
   - Write comprehensive tests
   - Document code thoroughly
   - Review code regularly

5. **Feature Completion Checklist**
   - Implement E2E tests for the feature
   - Run all test suites successfully
   - Conduct thorough code review
   - Document feature implementation
   - Update relevant documentation

### Quality Assurance Requirements

1. **TypeScript Configuration**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "noUncheckedIndexedAccess": true,
       "exactOptionalPropertyTypes": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noImplicitReturns": true,
       "allowJs": false
     }
   }
   ```

2. **Testing Requirements**
   - Minimum 80% code coverage
   - Co-located tests in `__tests__` folders
   - Use React Testing Library
   - Test behavior, not implementation
   - Mock external dependencies properly

3. **E2E Testing Protocol**
   ```powershell
   # After feature completion
   cd app
   # Install Playwright if not already installed
   npm install -D @playwright/test

   # Create E2E test for new feature
   touch tests/e2e/[feature-name].spec.ts

   # Run E2E tests
   npm run test:e2e
   ```

4. **SonarQube Quality Gates**
   - Maximum cognitive complexity: 15
   - Maximum cyclomatic complexity: 10
   - Maximum duplicated lines: 3%
   - Maximum technical debt ratio: 5%
   - Zero critical/blocker issues

2. **Code Review Process**
   - Review feature implementation against requirements
   - Verify test coverage (unit, integration, E2E)
   - Check for TypeScript strict compliance
   - Validate component documentation
   - Ensure accessibility standards
   - Confirm responsive design implementation
   - Verify error handling
   - Review performance implications

### PRP Structure Requirements

- **Goal**: Specific end state and desires
- **Why**: Business value and user impact
- **What**: User-visible behavior and technical requirements
- **All Needed Context**: Documentation URLs, code examples, gotchas, patterns
- **Implementation Blueprint**: Pseudocode with critical details and task lists
- **Validation Loop**: Executable commands for syntax, tests, integration

### Validation Gates (Must be Executable)

```bash
# Level 1: Syntax & Style
ruff check --fix && mypy .

# Level 2: Unit Tests
uv run pytest tests/ -v

# Level 3: Integration
uv run uvicorn main:app --reload
curl -X POST http://localhost:8000/endpoint -H "Content-Type: application/json" -d '{...}'

# Level 4: Deployment
# mcp servers, or other creative ways to self validate
```

## Best Practices

- **Create comprehensive context**: Include complete documentation, examples, and references for self-contained PRPs
- **Follow validation steps**: Execute all validation steps for successful implementation
- **Use structured PRP format**: Follow the battle-tested PRP structure for consistency
- **Leverage existing templates**: Use and extend established patterns
- **Configure values properly**: Use configuration files for variable values
- **Handle exceptions specifically**: Implement precise error handling for each case

## Working with This Framework

### When Creating new PRPs

1. **Context Process**: New PRPs must consist of context sections, Context is King!
2.

### Feature Development Lifecycle

1. **Planning Phase**
   - Load PRP and understand requirements
   - Create comprehensive implementation plan
   - Break down into manageable tasks
   - Design component architecture

2. **Implementation Phase**
   - Write component code
   - Implement unit tests
   - Add integration tests
   - Create E2E test scenarios
   - Document component usage

3. **Quality Assurance Phase**
   ```powershell
   # Run all tests
   npm run test:all

   # Perform code review
   npm run review
   ```

4. **Review Phase**
   - Complete code review checklist
   - Address review feedback
   - Update documentation
   - Verify E2E test coverage
   - Check accessibility compliance

5. **Release Phase**
   - Final test suite execution
   - Documentation review
   - Performance verification
   - Merge approval

### Security and Performance Guidelines

1. **Security Requirements**
   - Sanitize all user inputs with Zod
   - Validate file uploads (type, size, content)
   - Implement proper XSS prevention
   - Use CSP headers in production
   - Handle sensitive data securely
   - Validate all API responses

2. **Performance Optimization**
   - Use React 19's built-in compiler optimizations
   - Implement code splitting at route level
   - Lazy load heavy components
   - Use proper Suspense boundaries
   - Optimize bundle size with manual chunks
   ```typescript
   // vite.config.ts
   export default defineConfig({
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

### Command Usage

- Read the .claude/commands directory
- Access via `/` prefix in Claude Code
- Commands are self-documenting with argument placeholders
- Use parallel creation commands for rapid development
- Leverage existing review and refactoring commands

## Project Structure Understanding

```
PRPs-agentic-eng/
.claude/
  commands/           # 28+ Claude Code commands
  settings.local.json # Tool permissions
PRPs/
  templates/          # PRP templates with validation
  scripts/           # PRP runner and utilities
  ai_docs/           # Curated Claude Code documentation
   *.md               # Active and example PRPs
 claude_md_files/        # Framework-specific CLAUDE.md examples
 pyproject.toml         # Python package configuration
```

Remember: This framework is about **one-pass implementation success through comprehensive context and validation**. Every PRP should contain the exact context for an AI agent to successfully implement working code in a single pass.
````
