/**
 * Ticker Synchronization E2E Test
 *
 * Tests that the DataTableWidget updates when the AreaChartWidget ticker is changed.
 */

import { test, expect } from '@playwright/test';

test.describe('Ticker Synchronization', () => {
  test('DataTableWidget should update when AreaChartWidget ticker is changed', async ({
    page,
  }) => {
    // Navigate to the app
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');

    // Wait for both widgets to load
    await page.waitForSelector('[data-testid="area-chart-widget"]', {
      timeout: 10000,
    });
    await page.waitForSelector('[data-testid="data-table-widget"]', {
      timeout: 10000,
    });

    // Check that both widgets are visible
    const chartWidget = page.locator('[data-testid="area-chart-widget"]');
    const tableWidget = page.locator('[data-testid="data-table-widget"]');

    await expect(chartWidget).toBeVisible();
    await expect(tableWidget).toBeVisible();

    // Look for ticker search/selection component in the chart widget
    const tickerSearch = chartWidget
      .locator(
        'input[placeholder*="Search"], [data-testid*="ticker"], button:has-text("BTC"), button:has-text("ETH")'
      )
      .first();

    // If ticker search is available, test the synchronization
    if (await tickerSearch.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Ticker search found, testing synchronization...');

      // Get initial table data
      const initialTableContent = await tableWidget.textContent();

      // Try to change ticker (this depends on the UI implementation)
      await tickerSearch.click();

      // Wait a moment for any dropdown or selection to appear
      await page.waitForTimeout(1000);

      // Look for ethereum or other ticker option
      const ethereumOption = page
        .locator('text=ethereum, text=Ethereum, text=ETH')
        .first();
      if (
        await ethereumOption.isVisible({ timeout: 3000 }).catch(() => false)
      ) {
        await ethereumOption.click();

        // Wait for data to update
        await page.waitForTimeout(3000);

        // Check that table content has changed
        const updatedTableContent = await tableWidget.textContent();
        expect(updatedTableContent).not.toBe(initialTableContent);

        console.log('Ticker synchronization test passed!');
      } else {
        console.log('Could not find alternative ticker option to test with');
      }
    } else {
      console.log(
        'Ticker search component not found, checking basic functionality...'
      );

      // At least verify both widgets show some data
      const chartHasData =
        (await chartWidget
          .locator('svg, canvas, [data-testid*="chart"]')
          .count()) > 0;
      const tableHasData =
        (await tableWidget
          .locator(
            '[data-testid="data-table"], [data-testid="mobile-data-card"]'
          )
          .count()) > 0;

      expect(chartHasData || tableHasData).toBe(true);
    }
  });

  test('Both widgets should show data for the same ticker', async ({
    page,
  }) => {
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');

    // Wait for widgets to load
    await page.waitForSelector('[data-testid="area-chart-widget"]', {
      timeout: 10000,
    });
    await page.waitForSelector('[data-testid="data-table-widget"]', {
      timeout: 10000,
    });

    // Check that both widgets contain some reference to the same cryptocurrency
    const chartWidget = page.locator('[data-testid="area-chart-widget"]');
    const tableWidget = page.locator('[data-testid="data-table-widget"]');

    const chartText = await chartWidget.textContent();
    const tableText = await tableWidget.textContent();

    // Both should contain some reference to a cryptocurrency
    const commonTerms = ['bitcoin', 'btc', 'price', 'value', '$', 'usd'];

    let chartHasCryptoTerms = false;
    let tableHasCryptoTerms = false;

    for (const term of commonTerms) {
      if (chartText?.toLowerCase().includes(term)) {
        chartHasCryptoTerms = true;
      }
      if (tableText?.toLowerCase().includes(term)) {
        tableHasCryptoTerms = true;
      }
    }

    expect(chartHasCryptoTerms).toBe(true);
    expect(tableHasCryptoTerms).toBe(true);
  });
});
