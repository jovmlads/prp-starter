/**
 * Debug Data Table Content
 */

import { test, expect } from '@playwright/test';

test('Debug DataTableWidget content', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await page.waitForLoadState('networkidle');

  // Wait for widgets
  await page.waitForSelector('[data-testid="data-table-widget"]', {
    timeout: 10000,
  });

  const tableWidget = page.locator('[data-testid="data-table-widget"]');
  await expect(tableWidget).toBeVisible();

  // Get the full text content
  const tableText = await tableWidget.textContent();
  console.log('Table Widget Content:', tableText);

  // Check for specific elements
  const hasTable = await page
    .locator('[data-testid="data-table"]')
    .isVisible()
    .catch(() => false);
  const hasMobileCards = await page
    .locator('[data-testid="mobile-data-card"]')
    .isVisible()
    .catch(() => false);
  const hasLoadingState = await page
    .locator('[data-testid="table-loading"]')
    .isVisible()
    .catch(() => false);

  console.log('Has desktop table:', hasTable);
  console.log('Has mobile cards:', hasMobileCards);
  console.log('Has loading state:', hasLoadingState);

  // Check for error states
  const hasError =
    (await tableWidget
      .locator('text=error, text=Error, text=unavailable')
      .count()) > 0;
  console.log('Has error:', hasError);

  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-table-widget.png', fullPage: true });
});
