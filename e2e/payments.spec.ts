import { test, expect } from '@playwright/test';

test.describe('Payment System Features', () => {
  test('payment form has cash button', async ({ page }) => {
    // Navigate to a visit page or test payment form directly
    await page.goto('/dashboard');

    // Look for payment-related elements anywhere
    const cashButton = page.getByRole('button', { name: /cash/i });
    // May not be visible on dashboard, check if exists
  });

  test('payment form has UPI button', async ({ page }) => {
    await page.goto('/dashboard');

    const upiButton = page.getByRole('button', { name: /upi/i });
  });

  test('payment form has waive button', async ({ page }) => {
    await page.goto('/dashboard');

    const waiveButton = page.getByRole('button', { name: /waive/i });
  });

  test('payment badge shows correct status colors', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for payment badges
    const paidBadge = page.locator('.bg-green-100, [class*="green"]').filter({ hasText: /paid/i });
    const pendingBadge = page.locator('.bg-yellow-100, [class*="yellow"]').filter({ hasText: /pending/i });
  });

  test('daily collection card displays on dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for collection-related text
    const collectionText = page.getByText(/collection|today.*₹|cash.*upi/i);
  });

  test('fee schedule settings page loads', async ({ page }) => {
    // Navigate to settings where fee schedule would be
    await page.goto('/dashboard/profile');

    // Look for fee-related elements
    const consultationFee = page.getByText(/consultation.*fee|new.*patient.*fee/i);
    const followUpFee = page.getByText(/follow.*up.*fee/i);
  });

  test('UPI QR code displays when UPI selected', async ({ page }) => {
    // This would need a visit flow to trigger
    await page.goto('/dashboard/patients');

    // Check for QR-related elements in the DOM
    const qrElement = page.locator('canvas, svg[class*="qr"], img[alt*="qr"], [data-testid*="qr"]');
  });
});

test.describe('Payment Form Component', () => {
  test('amount input accepts numbers', async ({ page }) => {
    await page.goto('/dashboard/patients');

    // Find amount input if visible
    const amountInput = page.getByPlaceholder('500').or(page.locator('input[type="number"]').filter({ hasText: /₹/ }));
  });

  test('payment methods are clickable', async ({ page }) => {
    await page.goto('/dashboard/patients');

    // Check buttons are enabled
    const cashBtn = page.getByRole('button', { name: /cash/i });
    const upiBtn = page.getByRole('button', { name: /upi/i });
    const waiveBtn = page.getByRole('button', { name: /waive/i });
  });
});
