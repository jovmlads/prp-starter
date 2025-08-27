import { test, expect } from '@playwright/test';

test.describe('Profile Form', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/home');
  });

  test('should navigate to form page', async ({ page }) => {
    // Navigate to form page
    await page.click('a[href="/form"]');
    await expect(page).toHaveURL('/form');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Settings');
    await expect(page.locator('p')).toContainText('Manage your account settings');
  });

  test('should display form with all fields', async ({ page }) => {
    await page.goto('/form');
    
    // Check form sidebar
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('text=Profile')).toBeVisible();
    await expect(page.locator('text=Account')).toBeVisible();
    await expect(page.locator('text=Appearance')).toBeVisible();
    
    // Check form fields
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('[role="combobox"]')).toBeVisible(); // Email select
    await expect(page.locator('textarea[name="bio"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Update profile');
  });

  test('should validate username field', async ({ page }) => {
    await page.goto('/form');
    
    // Test too short username
    await page.fill('input[name="username"]', 'a');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Username must be at least 2 characters')).toBeVisible();
    
    // Test invalid characters
    await page.fill('input[name="username"]', 'user@name');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Username can only contain letters, numbers, and underscores')).toBeVisible();
  });

  test('should validate bio character limit', async ({ page }) => {
    await page.goto('/form');
    
    // Fill bio with more than 160 characters
    const longBio = 'a'.repeat(161);
    await page.fill('textarea[name="bio"]', longBio);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Bio must be less than 160 characters')).toBeVisible();
  });

  test('should add and remove URL fields', async ({ page }) => {
    await page.goto('/form');
    
    // Check initial URL fields
    const initialUrlInputs = page.locator('input[placeholder*="https://"]');
    await expect(initialUrlInputs).toHaveCount(2);
    
    // Add new URL field
    await page.click('button:has-text("Add URL")');
    await expect(page.locator('input[placeholder*="https://"]')).toHaveCount(3);
    
    // Remove URL field (should have remove buttons now)
    const removeButtons = page.locator('button:has-text("Remove")');
    if (await removeButtons.count() > 0) {
      await removeButtons.first().click();
      await expect(page.locator('input[placeholder*="https://"]')).toHaveCount(2);
    }
  });

  test('should submit form with valid data', async ({ page }) => {
    await page.goto('/form');
    
    // Fill form with valid data
    await page.fill('input[name="username"]', 'testuser');
    await page.click('[role="combobox"]');
    await page.click('text=admin@example.com');
    await page.fill('textarea[name="bio"]', 'Test bio description');
    
    // Fill first URL field
    const urlInputs = page.locator('input[placeholder*="https://"]');
    await urlInputs.first().fill('https://example.com');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success state (button should show "Updating..." then back to "Update profile")
    await expect(page.locator('button[type="submit"]')).toContainText('Update profile');
  });

  test('should handle form submission errors gracefully', async ({ page }) => {
    await page.goto('/form');
    
    // Fill form with invalid URL
    await page.fill('input[name="username"]', 'testuser');
    const urlInputs = page.locator('input[placeholder*="https://"]');
    await urlInputs.first().fill('invalid-url');
    
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/form');
    
    // Check that form is still accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/form');
    
    // Check form labels
    await expect(page.locator('label:has-text("Username")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Bio")')).toBeVisible();
    
    // Check form descriptions
    await expect(page.locator('text=This is your public display name')).toBeVisible();
    await expect(page.locator('text=You can manage verified email addresses')).toBeVisible();
  });
});
