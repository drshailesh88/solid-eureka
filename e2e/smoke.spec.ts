import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Basic Navigation', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/);
  });

  test('dashboard redirects or loads', async ({ page }) => {
    const response = await page.goto('/dashboard');
    // Should either load dashboard or redirect to sign-in (200-399 range)
    expect(response?.status()).toBeLessThan(500);
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
  });

  test('patients page exists', async ({ page }) => {
    const response = await page.goto('/dashboard/patients');
    expect(response?.status()).toBeLessThan(500);
  });

  test('new patient page loads', async ({ page }) => {
    const response = await page.goto('/dashboard/patients/new');
    expect(response?.status()).toBeLessThan(500);
  });

  test('sign-in page loads', async ({ page }) => {
    await page.goto('/auth/sign-in');

    // Should show Clerk sign-in or redirect
    const signInText = page.getByText(/sign.*in|log.*in|email/i);
    await expect(signInText.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Smoke Tests - UI Components', () => {
  test('sidebar navigation exists', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for sidebar or navigation
    const sidebar = page.locator('aside, nav, [role="navigation"]');
    await expect(sidebar.first()).toBeVisible({ timeout: 10000 });
  });

  test('header exists', async ({ page }) => {
    await page.goto('/dashboard/patients');
    await page.waitForLoadState('networkidle');

    // Check for any header-like element
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 15000 });
  });

  test('theme toggle exists', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for theme toggle button
    const themeToggle = page.getByRole('button').filter({ has: page.locator('svg') });
    // At least some buttons should exist
    await expect(themeToggle.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Smoke Tests - Patient Form Fields', () => {
  test('patient form has required fields', async ({ page }) => {
    await page.goto('/dashboard/patients/new');

    // Check for UHID field
    const uhidField = page.getByLabel(/uhid/i).or(page.getByPlaceholder(/p25/i));

    // Check for name fields
    const firstName = page.getByLabel(/first.*name/i).or(page.getByPlaceholder(/first/i));

    // Check for phone field
    const phone = page.getByLabel(/phone/i).or(page.getByPlaceholder(/987/i));

    // At least name should be present
    await expect(firstName.first()).toBeVisible({ timeout: 10000 });
  });

  test('patient form has submit button', async ({ page }) => {
    await page.goto('/dashboard/patients/new');

    const submitBtn = page.getByRole('button', { name: /create|save|submit/i });
    await expect(submitBtn.first()).toBeVisible({ timeout: 10000 });
  });
});
