import { test, expect } from '@playwright/test';

test.describe('Hello AI Agent Application', () => {
  test('should display title correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check if title exists and has correct text
    const title = page.locator('h1.title');
    await expect(title).toHaveText('Hello AI Agent');

    // Verify container styling
    const container = page.locator('.app-container');
    await expect(container).toBeVisible();

    // Title should be visible
    await expect(title).toBeVisible();

    // Test viewport changes
    // Tablet view
    await page.setViewportSize({ width: 768, height: 800 });
    await expect(title).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 480, height: 800 });
    await expect(title).toBeVisible();
  });

  test('should have correct styling and layout', async ({ page }) => {
    await page.goto('/');

    // Check container is visible
    const container = page.locator('.app-container');
    await expect(container).toBeVisible();

    // Check title is visible and centered
    const title = page.locator('.title');
    await expect(title).toBeVisible();
    await expect(title).toHaveCSS('text-align', 'center');
  });
});
