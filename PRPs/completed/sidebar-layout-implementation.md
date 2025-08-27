# Shadcn UI Sidebar-07 Layout Implementation Plan

## Phase 1: Initial Setup & Configuration

### 1.1 Initialize Shadcn UI

```powershell
# Navigate to project directory
Set-Location -Path "hello-ai-agent"

# Install and initialize Shadcn UI
npx shadcn-ui@latest init
```

When prompted, select:

- Style: Default
- Base color: Slate
- CSS variables: Yes
- React Server Components: No
- Tailwind CSS: Yes
- Components location: @/components/ui
- Utils location: @/lib/utils
- Include example components: Yes

### 1.2 Install Required Dependencies

```powershell
npm install @radix-ui/react-icons class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
```

### 1.3 Install Required Shadcn UI Components

```powershell
npx shadcn-ui@latest add button ; `
npx shadcn-ui@latest add separator ; `
npx shadcn-ui@latest add sheet
```

## Phase 2: Project Structure Setup

### 2.1 Create Required Directories

Create the following directory structure:

```
src/
├── components/
│   ├── ui/        # Shadcn UI components (auto-created)
│   └── layout/    # Layout components
├── lib/
│   └── utils.ts   # Utility functions (auto-created)
└── styles/
    └── globals.css # Global styles
```

### 2.2 Update Configuration Files

#### File: tailwind.config.js

```javascript
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## Phase 3: Component Implementation

### 3.1 Create Navigation Types

File: `src/types/nav.ts`

```typescript
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
```

### 3.2 Create Main Navigation Component

File: `src/components/layout/main-nav.tsx`

```typescript
import {
  LucideIcon,
  Home,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import { NavItem } from "@/types/nav";

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

interface MainNavProps {
  isCollapsed: boolean;
}

export function MainNav({ isCollapsed }: MainNavProps) {
  return (
    <div className="flex flex-col gap-2">
      {mainNavItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
        >
          <item.icon className="h-4 w-4" />
          {!isCollapsed && <span>{item.title}</span>}
        </a>
      ))}
    </div>
  );
}
```

### 3.3 Create User Navigation Component

File: `src/components/layout/user-nav.tsx`

```typescript
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface UserNavProps {
  isCollapsed: boolean;
}

export function UserNav({ isCollapsed }: UserNavProps) {
  return (
    <div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
        {!isCollapsed && (
          <div className="space-y-1">
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-slate-500">user@example.com</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3.4 Create Sidebar Component

File: `src/components/layout/sidebar.tsx`

```typescript
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden h-screen ${
          isCollapsed ? "w-16" : "w-64"
        } flex-col border-r px-4 py-6 transition-all duration-300 md:flex`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex items-center justify-between">
            {!isCollapsed && <h2 className="text-lg font-semibold">Logo</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-8">
            <MainNav isCollapsed={isCollapsed} />
          </div>

          {/* User */}
          <UserNav isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col px-4 py-6">
            <div className="flex-1 py-8">
              <MainNav isCollapsed={false} />
            </div>
            <UserNav isCollapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

### 3.5 Create Root Layout Component

File: `src/components/layout/root-layout.tsx`

```typescript
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export function RootLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
```

## Phase 4: Integration

### 4.1 Update App Component

File: `src/App.tsx`

```typescript
import { BrowserRouter as Router } from "react-router-dom";
import { RootLayout } from "./components/layout/root-layout";
import "./styles/globals.css";

function App() {
  return (
    <Router>
      <RootLayout />
    </Router>
  );
}

export default App;
```

## Phase 5: Testing

### 5.1 Component Tests

File: `src/components/layout/__tests__/sidebar.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../sidebar";

describe("Sidebar", () => {
  it("renders correctly", () => {
    render(<Sidebar />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("toggles collapse state on button click", () => {
    render(<Sidebar />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.queryByText("Logo")).not.toBeInTheDocument();
  });
});
```

### 5.2 E2E Tests

File: `tests/sidebar.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Sidebar", () => {
  test("shows full sidebar on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.getByText("Logo")).toBeVisible();
  });

  test("shows mobile menu on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.locator("aside")).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });
});
```

## Phase 6: Final Steps

1. Run all tests and verify they pass
2. Check responsive behavior across different screen sizes
3. Verify accessibility using screen readers and keyboard navigation
4. Test dark mode compatibility
5. Document any known issues or limitations

## Success Verification

- [ ] Sidebar matches Shadcn UI design specifications
- [ ] Mobile responsiveness works correctly
- [ ] Collapse/expand functionality works smoothly
- [ ] All navigation items are functional
- [ ] User section displays correctly
- [ ] Dark mode works as expected
- [ ] All tests pass
- [ ] Keyboard navigation works properly
- [ ] Screen reader compatibility verified
