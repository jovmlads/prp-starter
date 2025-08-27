# E2E Testing Guidelines - MANDATORY for React/Frontend Features

## Testing Protocol

**MANDATORY EXECUTION**: Playwright E2E tests MUST be executed automatically upon successful feature implementation. No exceptions for React/Frontend features.

**AUTO-EXECUTION**: AI agents should run E2E tests immediately after feature completion without asking for permission.

## Setup

1. Initialize Playwright in your project:

```powershell
npm init playwright@latest
```

2. Add test scripts to package.json:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

3. Create a basic test structure in `e2e` directory:

```
e2e/
├── fixtures/       # Test data and utilities
├── pages/         # Page object models
└── tests/         # Test files
```

## Writing Tests

### Page Object Model

```typescript
// e2e/pages/home.page.ts
export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async getTitle() {
    return this.page.getByRole("heading", { level: 1 });
  }
}
```

### Test Example

```typescript
// e2e/tests/home.spec.ts
import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("displays correct title", async () => {
    const title = await homePage.getTitle();
    await expect(title).toHaveText("Hello AI assisted app");
  });
});
```

## Best Practices

1. Use Page Object Model pattern
2. Write atomic tests
3. Handle test data properly
4. Use fixtures for common setup
5. Run tests in CI/CD pipeline
6. Keep screenshots and videos for failed tests

## Running Tests - Auto-Execution Protocol

```powershell
# MANDATORY: Run automatically after feature implementation
npm run test:e2e

# For debugging during development
npm run test:e2e:ui

# Debug specific test
npm run test:e2e:debug

# Run tests in specific browser
npm run test:e2e -- --project=chromium

# Update snapshots when UI changes
npm run test:e2e -- -u
```

**AI Agent Execution**: These commands should be executed automatically by AI agents upon feature completion. No user confirmation required.

## Continuous Integration

Add to your GitHub Actions workflow:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm run test:e2e
```
