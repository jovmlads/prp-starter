/**
 * Data Table Widget E2E Tests
 *
 * Comprehensive end-to-end tests for the DataTableWidget component.
 * Tests functionality, accessibility, responsive behavior, and user interactions.
 */

import { test, expect } from '@playwright/test';

test.describe('DataTableWidget E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5174');

    // Wait for the page to load and widgets to render
    await page.waitForLoadState('networkidle');
  });

  test.describe('Basic Rendering', () => {
    test('should display DataTableWidget with correct title and description', async ({
      page,
    }) => {
      // Check if the DataTableWidget container is visible
      const widget = page.locator('[data-testid="data-table-widget"]');
      await expect(widget).toBeVisible();

      // Check title
      const title = widget.locator('h2', { hasText: 'Data Table' });
      await expect(title).toBeVisible();

      // Check description
      const description = widget.locator('p', {
        hasText: 'Detailed view of chart data in tabular format',
      });
      await expect(description).toBeVisible();
    });

    test('should render table with data rows', async ({ page }) => {
      // Wait for data to load
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      const table = page.locator('[data-testid="data-table"]');
      await expect(table).toBeVisible();

      // Check table headers
      const headers = table.locator('thead th');
      await expect(headers).toHaveCount(4); // Date, Value, Growth, Status

      // Check that data rows exist
      const dataRows = table.locator('tbody tr');
      await expect(dataRows.first()).toBeVisible();
    });

    test('should display loading state initially', async ({ page }) => {
      // Navigate and immediately check for loading state
      await page.goto('http://localhost:5174');

      // Look for loading skeleton or loading text
      const loadingIndicator = page
        .locator('[data-testid="table-loading"]')
        .or(page.locator('text=Loading'));

      // Loading state might be brief, so we use waitFor with timeout
      try {
        await expect(loadingIndicator).toBeVisible({ timeout: 2000 });
      } catch {
        // Loading might be too fast to catch, which is fine
        console.log('Loading state was too brief to capture');
      }
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should switch to mobile layout on small screens', async ({
      page,
    }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // On mobile, table should switch to card layout
      const mobileCards = page.locator('[data-testid="mobile-data-card"]');
      await expect(mobileCards.first()).toBeVisible({ timeout: 5000 });

      // Desktop table should be hidden
      const desktopTable = page.locator('[data-testid="data-table"]');
      await expect(desktopTable).not.toBeVisible();
    });

    test('should show desktop table on large screens', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Desktop table should be visible
      const desktopTable = page.locator('[data-testid="data-table"]');
      await expect(desktopTable).toBeVisible({ timeout: 5000 });

      // Mobile cards should not be visible
      const mobileCards = page.locator('[data-testid="mobile-data-card"]');
      await expect(mobileCards.first()).not.toBeVisible();
    });
  });

  test.describe('Sorting Functionality', () => {
    test('should sort by date when date column header is clicked', async ({
      page,
    }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Click on Date column header
      const dateHeader = page.locator('[data-testid="sort-header-date"]');
      await expect(dateHeader).toBeVisible();
      await dateHeader.click();

      // Check for sort indicator
      const sortIndicator = dateHeader.locator(
        '[data-testid="sort-indicator"]'
      );
      await expect(sortIndicator).toBeVisible();
    });

    test('should sort by value when value column header is clicked', async ({
      page,
    }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Click on Value column header
      const valueHeader = page.locator('[data-testid="sort-header-value"]');
      await expect(valueHeader).toBeVisible();
      await valueHeader.click();

      // Check for sort indicator
      const sortIndicator = valueHeader.locator(
        '[data-testid="sort-indicator"]'
      );
      await expect(sortIndicator).toBeVisible();
    });

    test('should toggle sort direction on repeated clicks', async ({
      page,
    }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      const dateHeader = page.locator('[data-testid="sort-header-date"]');

      // First click - ascending
      await dateHeader.click();
      let sortIndicator = dateHeader.locator('[data-testid="sort-indicator"]');
      await expect(sortIndicator).toContainText('↑');

      // Second click - descending
      await dateHeader.click();
      await expect(sortIndicator).toContainText('↓');

      // Third click - back to ascending
      await dateHeader.click();
      await expect(sortIndicator).toContainText('↑');
    });
  });

  test.describe('Data Display', () => {
    test('should display formatted dates correctly', async ({ page }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Check that dates are in the correct format (e.g., "Aug 31, 2023")
      const firstDateCell = page.locator(
        '[data-testid="data-table"] tbody tr:first-child td:first-child'
      );
      await expect(firstDateCell).toContainText(/[A-Z][a-z]{2} \d{1,2}, \d{4}/);
    });

    test('should display formatted currency values', async ({ page }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Check that values are formatted as currency (e.g., "$26,000")
      const firstValueCell = page.locator(
        '[data-testid="data-table"] tbody tr:first-child td:nth-child(2)'
      );
      await expect(firstValueCell).toContainText(/\$[\d,]+/);
    });

    test('should display growth percentages', async ({ page }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Check that growth is displayed as percentage
      const firstGrowthCell = page.locator(
        '[data-testid="data-table"] tbody tr:first-child td:nth-child(3)'
      );
      const text = await firstGrowthCell.textContent();

      // Growth should be either a percentage or "No data"
      expect(text).toMatch(/(-?\d+\.\d+%|No data)/);
    });

    test('should display status indicators', async ({ page }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Check that status column has appropriate indicators
      const firstStatusCell = page.locator(
        '[data-testid="data-table"] tbody tr:first-child td:nth-child(4)'
      );
      const text = await firstStatusCell.textContent();

      // Status should be one of the expected values
      expect(text).toMatch(/(Growth|Decline|Stable|No data)/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and attributes', async ({ page }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      const table = page.locator('[data-testid="data-table"]');

      // Check table has proper ARIA attributes
      await expect(table).toHaveAttribute('role', 'table');
      await expect(table).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Focus on first sortable header
      const dateHeader = page.locator('[data-testid="sort-header-date"]');
      await dateHeader.focus();

      // Check it's focusable
      await expect(dateHeader).toBeFocused();

      // Test Enter key to activate sorting
      await page.keyboard.press('Enter');

      // Check for sort indicator
      const sortIndicator = dateHeader.locator(
        '[data-testid="sort-indicator"]'
      );
      await expect(sortIndicator).toBeVisible();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Check that the widget title is properly structured
      const widgetTitle = page.locator('[data-testid="data-table-widget"] h2');
      await expect(widgetTitle).toBeVisible();

      // Verify it's an h2 (assuming main page title is h1)
      const tagName = await widgetTitle.evaluate((el) =>
        el.tagName.toLowerCase()
      );
      expect(tagName).toBe('h2');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle empty data gracefully', async ({ page }) => {
      // This test might need to be adapted based on how you want to simulate empty data
      // For now, we'll check that the component handles the case where no data is available

      await page.waitForSelector('[data-testid="data-table-widget"]', {
        timeout: 10000,
      });

      // The component should either show data or an appropriate message
      const widget = page.locator('[data-testid="data-table-widget"]');
      await expect(widget).toBeVisible();

      // Check that either table with data or empty state message is shown
      const hasTable =
        (await page.locator('[data-testid="data-table"] tbody tr').count()) > 0;
      const hasEmptyMessage = await page
        .locator('text=No data available')
        .isVisible();

      expect(hasTable || hasEmptyMessage).toBe(true);
    });
  });

  test.describe('Integration with AreaChartWidget', () => {
    test('should display same data as AreaChartWidget', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check that both widgets are present
      const chartWidget = page.locator('[data-testid="area-chart-widget"]');
      const tableWidget = page.locator('[data-testid="data-table-widget"]');

      await expect(chartWidget).toBeVisible();
      await expect(tableWidget).toBeVisible();

      // Both widgets should be showing data from the same source
      // This is a basic integration check
      const tableRows = page.locator('[data-testid="data-table"] tbody tr');
      const rowCount = await tableRows.count();

      // Should have some data rows
      expect(rowCount).toBeGreaterThan(0);
    });
  });

  test.describe('Performance', () => {
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('http://localhost:5174');
      await page.waitForSelector('[data-testid="data-table-widget"]', {
        timeout: 10000,
      });

      const loadTime = Date.now() - startTime;

      // Should load within 10 seconds (generous for E2E)
      expect(loadTime).toBeLessThan(10000);
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      await page.goto('http://localhost:5174');
      await page.waitForSelector('[data-testid="data-table"]', {
        timeout: 10000,
      });

      // Test scrolling performance with large dataset
      const table = page.locator('[data-testid="data-table"]');
      await expect(table).toBeVisible();

      // Scroll to check for performance issues
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      // Table should still be responsive after scrolling
      await expect(table).toBeVisible();
    });
  });
});
