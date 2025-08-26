import { test, expect } from '@playwright/test';

test.describe('Hello AI Agent Application', () => {
  test('should display title correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Check if title exists and has correct text
    const title = page.locator('h1.title');
    await expect(title).toHaveText('Hello AI Agent');

    // Verify container styling
    const container = page.locator('.app-container');
    await expect(container).toBeVisible();

    // Test responsive design
    // Desktop view (default)
    await expect(title).toHaveCSS('font-size', '2.5rem');

    // Tablet view
    await page.setViewportSize({ width: 768, height: 800 });
    await expect(title).toHaveCSS('font-size', '2rem');

    // Mobile view
    await page.setViewportSize({ width: 480, height: 800 });
    await expect(title).toHaveCSS('font-size', '1.5rem');
  });

  test('should have correct styling and layout', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check container positioning
    const container = page.locator('.app-container');
    await expect(container).toHaveCSS('display', 'flex');
    await expect(container).toHaveCSS('justify-content', 'center');
    await expect(container).toHaveCSS('align-items', 'center');
    await expect(container).toHaveCSS('min-height', '100vh');

    // Check title styling
    const title = page.locator('.title');
    await expect(title).toHaveCSS('color', 'rgb(51, 51, 51)'); // #333
    await expect(title).toHaveCSS('text-align', 'center');
  });
});
