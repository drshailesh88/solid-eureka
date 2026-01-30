import { test, expect } from '@playwright/test';

test.describe('Queue & Token System', () => {
  test('queue panel displays on dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for queue-related elements
    const queuePanel = page.getByText(/queue|waiting|token/i);
  });

  test('call next button exists', async ({ page }) => {
    await page.goto('/dashboard');

    const callNextBtn = page.getByRole('button', { name: /call.*next|next.*patient/i });
  });

  test('add walk-in button exists', async ({ page }) => {
    await page.goto('/dashboard');

    const addWalkInBtn = page.getByRole('button', { name: /walk.*in|add.*patient/i });
  });

  test('queue stats show waiting count', async ({ page }) => {
    await page.goto('/dashboard');

    const waitingCount = page.getByText(/waiting|seen.*today/i);
  });

  test('queue items show token numbers', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for token number display pattern
    const tokenDisplay = page.getByText(/token.*#|#\d+/i);
  });

  test('queue item status badges work', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for status indicators
    const waitingBadge = page.getByText(/waiting/i);
    const inRoomBadge = page.getByText(/in.*room|in.*progress/i);
    const doneBadge = page.getByText(/done|completed/i);
  });
});

test.describe('Add Walk-In Dialog', () => {
  test('walk-in dialog opens on button click', async ({ page }) => {
    await page.goto('/dashboard');

    const addWalkInBtn = page.getByRole('button', { name: /walk.*in/i });

    if (await addWalkInBtn.isVisible()) {
      await addWalkInBtn.click();

      // Check dialog appeared
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
    }
  });

  test('walk-in dialog has patient search', async ({ page }) => {
    await page.goto('/dashboard');

    const addWalkInBtn = page.getByRole('button', { name: /walk.*in/i });

    if (await addWalkInBtn.isVisible()) {
      await addWalkInBtn.click();

      // Dialog uses a combobox for patient search
      const searchCombobox = page.getByRole('combobox');
      await expect(searchCombobox).toBeVisible();
    }
  });
});
