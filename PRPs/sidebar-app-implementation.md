name: "Sidebar React App Implementation"
description: |
Detailed implementation guide for creating a React application with a responsive
collapsible sidebar, based on the planning document at PRPs/sidebar-app-planning.md.

---

## Goal

Build a modern React application with a responsive collapsible sidebar that works seamlessly across all devices, following the design reference from adminmart.com.

### Feature Goal

Create a solid foundation for a React application with a well-designed, responsive sidebar navigation system.

### Deliverable

A working React application with:

- Responsive sidebar navigation
- Clean home page layout
- TypeScript type safety
- Mobile-first design approach

### Success Definition

All success indicators from the planning document are met, including:

- TypeScript compilation passes
- Responsive design works on all breakpoints
- Smooth animations (60fps)
- Proper mobile behavior

## User Persona (if applicable)

**Web Application User**

- Uses the application on both desktop and mobile devices
- Expects smooth, intuitive navigation
- Values quick access to different sections of the app
- Needs clear visual feedback for interactions

## Why

As specified in the planning document, a well-designed sidebar navigation is crucial for:

- Efficient navigation in web applications
- Optimal use of screen real estate
- Improved mobile user experience
- Foundation for future feature additions

## What

### Functional Requirements

1. Responsive sidebar that collapses/expands on desktop
2. Auto-collapsing sidebar on mobile with hamburger menu
3. Smooth transitions for all state changes
4. Clean, minimal home page layout

### Technical Requirements

1. React 18+ with TypeScript
2. Vite for development
3. TailwindCSS for styling
4. React Icons for iconography

## All Needed Context

### Context Completeness Check

_Before implementation: "Does this PRP provide everything needed to build the feature successfully?"_

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://vitejs.dev/guide/#scaffolding-your-first-vite-project
  why: Project setup with Vite + React + TypeScript
  critical: Use --template react-ts flag for proper TypeScript setup

- url: https://tailwindcss.com/docs/guides/vite
  why: TailwindCSS setup in Vite project
  critical: PostCSS configuration for Vite

- url: https://react-icons.github.io/react-icons/
  why: Icon usage in React components
  critical: Tree-shaking for performance

- url: https://adminmart.com/build-react-sidebar-with-help-of-npm-package/
  why: Design reference for sidebar implementation
  critical: Layout structure and responsive patterns
```

### Repository Structure Requirements

```yaml
# MANDATORY Directory Structure
root_directory: PRPs-agentic-eng/  # Repository root
app_directory: app/                # MANDATORY directory for all React applications

# Standard Repository Layout
PRPs-agentic-eng/
├── app/                # React application root (MANDATORY)
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Project dependencies
```

### Current Codebase tree

```bash
# To be created - new project
```

### Desired Codebase tree

```bash
app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx         # Main layout wrapper
│   │   │   ├── Header.tsx         # Top header with toggle
│   │   │   ├── Sidebar.tsx        # Main sidebar component
│   │   │   ├── SidebarHeader.tsx  # Sidebar header section
│   │   │   ├── SidebarContent.tsx # Sidebar navigation content
│   │   │   └── SidebarFooter.tsx  # Sidebar footer section
│   │   └── ui/
│   │       └── HamburgerMenu.tsx  # Hamburger menu button
│   ├── contexts/
│   │   └── SidebarContext.tsx     # Sidebar state management
│   ├── hooks/
│   │   └── useSidebar.ts          # Sidebar custom hook
│   ├── styles/
│   │   └── globals.css            # Global styles and Tailwind
│   ├── types/
│   │   └── sidebar.ts             # Sidebar-related types
│   ├── pages/
│   │   └── Home.tsx               # Home page component
│   ├── App.tsx                    # Main App component
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts             # Vite type declarations
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── postcss.config.js             # PostCSS config
├── tailwind.config.js            # Tailwind config
└── vite.config.ts                # Vite config
```

### Known Gotchas of our codebase & Library Quirks

```typescript
// CRITICAL: Vite requires explicit file extensions for imports
import Layout from './components/layout/Layout.tsx'

// CRITICAL: TailwindCSS requires content paths in config
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}

// CRITICAL: React.lazy requires Suspense wrapper
import { Suspense } from 'react'
const HomePage = lazy(() => import('./pages/Home'))

// CRITICAL: TypeScript strict mode enabled
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Implementation Blueprint

### Data models and structure

```typescript
// src/types/sidebar.ts
export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items?: MenuItem[];
}

export interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}
```

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: Project Setup
  - IMPLEMENT: Create new Vite project with React + TypeScript
  - FOLLOW: Standard setup instructions in `/PRPs/templates/project_setup.md`
  - CRITICAL: Use specified Tailwind CSS versions (3.3.3) and setup method
  - CONFIG: Follow PowerShell commands for consistency

Task 2: CREATE src/types/sidebar.ts
  - IMPLEMENT: TypeScript interfaces for sidebar components
  - FOLLOW: Interface definitions from planning document
  - NAMING: PascalCase for interfaces, camelCase for properties
  - PLACEMENT: All type definitions in types folder

Task 3: CREATE src/contexts/SidebarContext.tsx
  - IMPLEMENT: React Context for sidebar state management
  - FOLLOW: Context pattern with TypeScript generics
  - INCLUDE: Mobile detection logic
  - PLACEMENT: Context provider at app root

Task 4: CREATE src/hooks/useSidebar.ts
  - IMPLEMENT: Custom hook for sidebar state management
  - FOLLOW: React hooks pattern with TypeScript
  - INCLUDE: Window resize handling for responsiveness
  - PLACEMENT: Hooks directory for reusability

Task 5: CREATE src/components/ui/HamburgerMenu.tsx
  - IMPLEMENT: Animated hamburger menu button
  - FOLLOW: Tailwind for styling and transitions
  - INCLUDE: Accessibility attributes
  - PLACEMENT: UI components directory

Task 6: CREATE src/components/layout/*.tsx
  - IMPLEMENT: Layout components (Sidebar, Header, etc.)
  - FOLLOW: Component structure from planning
  - DEPENDENCIES: Use types from Task 2
  - PLACEMENT: Layout components directory

Task 7: CREATE src/pages/Home.tsx
  - IMPLEMENT: Basic home page with content
  - FOLLOW: Page component pattern
  - DEPENDENCIES: Layout components from Task 6
  - PLACEMENT: Pages directory

Task 8: CREATE src/App.tsx and main.tsx
  - IMPLEMENT: App setup with routing and providers
  - FOLLOW: Vite entry point pattern
  - DEPENDENCIES: All previous components
  - PLACEMENT: Root of src directory

Task 9: CREATE src/styles/globals.css
  - IMPLEMENT: Global styles and Tailwind directives
  - FOLLOW: Mobile-first responsive design
  - INCLUDE: Custom utilities for transitions
  - PLACEMENT: Styles directory
```

### Implementation Patterns & Key Details

```typescript
// Sidebar Context Pattern
export const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  isMobile: false,
  toggleSidebar: () => {},
});

// Mobile Detection Hook
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", checkMobile);
    checkMobile();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return { isOpen, isMobile, toggleSidebar: () => setIsOpen((prev) => !prev) };
}

// Layout Component Pattern
export function Layout({ children }: LayoutProps) {
  const { isOpen, isMobile } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
```

### Integration Points

```yaml
VITE:
  - config: vite.config.ts
  - pattern: |
    export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          '@': '/src'
        }
      }
    })

TAILWIND:
  - config: tailwind.config.js
  - content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
  - theme: |
    extend: {
      width: {
        sidebar: '16rem',
        'sidebar-collapsed': '5rem'
      }
    }

TYPESCRIPT:
  - config: tsconfig.json
  - strict: true
  - paths: {"@/*": ["./src/*"]}
```

## Validation Loop

### Level 1: Syntax & Type Safety

```bash
# TypeScript compilation
npm run typecheck        # tsc --noEmit

# Linting
npm run lint            # eslint . --ext ts,tsx

# Format check
npm run format:check    # prettier --check .
```

### Level 2: Component Testing

```bash
# Component rendering
npm test                # vitest run

# Test cases to implement:
- Sidebar expands/collapses correctly
- Mobile detection works
- Transitions are smooth
- Accessibility features work
```

### Level 3: Integration Testing

```bash
# Start dev server
npm run dev

# Manual testing checklist:
- Verify sidebar behavior on all breakpoints
- Check animation smoothness
- Test touch interactions on mobile
- Verify no layout shifts
```

### Level 4: Production Readiness

```bash
# Build check
npm run build          # No errors/warnings

# Performance testing:
- Lighthouse score > 90
- FPS monitoring during animations
- Bundle size analysis
```

## Final Validation Checklist

### Technical Validation

- [ ] TypeScript compilation passes
- [ ] No ESLint warnings/errors
- [ ] All tests passing
- [ ] Build succeeds with no warnings

### Feature Validation

- [ ] Sidebar expands/collapses smoothly
- [ ] Mobile responsiveness works correctly
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts during transitions

### Code Quality Validation

- [ ] Follows React best practices
- [ ] Proper TypeScript usage
- [ ] Consistent code style
- [ ] Well-organized project structure

### Mobile & Performance

- [ ] Works well on mobile devices
- [ ] Quick initial load time
- [ ] Smooth animations
- [ ] No performance issues

## Anti-Patterns to Avoid

1. **React/TypeScript Anti-Patterns**

   - ❌ Any type usage
   - ❌ Direct DOM manipulation
   - ❌ Complex state management for simple features
   - ❌ Prop drilling instead of context

2. **Layout Anti-Patterns**

   - ❌ Non-semantic HTML
   - ❌ Fixed pixel values
   - ❌ Non-responsive design
   - ❌ Layout shifts

3. **Performance Anti-Patterns**
   - ❌ Blocking animations
   - ❌ Unoptimized images
   - ❌ Unnecessary re-renders
   - ❌ Heavy libraries for simple features
