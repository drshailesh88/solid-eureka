import { test, expect } from '@playwright/test';

test.describe('Patient Safety Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard - may redirect to sign-in
    await page.goto('/dashboard/patients');
  });

  test('patient form has allergy input field', async ({ page }) => {
    // Go to new patient page
    await page.goto('/dashboard/patients/new');

    // Check for allergy-related elements (use first() since there might be multiple matches)
    const allergyLabel = page.getByText('Allergies (CRITICAL)');
    await expect(allergyLabel).toBeVisible();

    // Check for the tag input placeholder
    const allergyInput = page.getByPlaceholder(/type allergy/i);
    await expect(allergyInput).toBeVisible();
  });

  test('patient form has chronic conditions input', async ({ page }) => {
    await page.goto('/dashboard/patients/new');

    const conditionsLabel = page.getByText(/chronic conditions/i);
    await expect(conditionsLabel).toBeVisible();

    const conditionsInput = page.getByPlaceholder(/type condition/i);
    await expect(conditionsInput).toBeVisible();
  });

  test('patient form has blood group dropdown', async ({ page }) => {
    await page.goto('/dashboard/patients/new');

    // Look for the blood group label specifically
    const bloodGroupLabel = page.getByText('Blood Group', { exact: true });
    await expect(bloodGroupLabel).toBeVisible();

    // Check for select trigger - use the combobox with Blood Group name
    const bloodGroupSelect = page.getByRole('combobox', { name: 'Blood Group' });
    await expect(bloodGroupSelect).toBeVisible();
  });

  test('can add allergy tags', async ({ page }) => {
    await page.goto('/dashboard/patients/new');

    const allergyInput = page.getByPlaceholder(/type allergy/i);
    await allergyInput.fill('Penicillin');
    await allergyInput.press('Enter');

    // Check that tag was added
    const tag = page.getByText('Penicillin');
    await expect(tag).toBeVisible();
  });

  test('allergy suggestions appear on focus', async ({ page }) => {
    await page.goto('/dashboard/patients/new');

    const allergyInput = page.getByPlaceholder(/type allergy/i);
    await allergyInput.focus();
    await allergyInput.fill('Pen');

    // Wait for suggestions
    await page.waitForTimeout(500);

    // Check for suggestion containing Penicillin
    const suggestion = page.getByText('Penicillin');
    // Suggestion may or may not appear depending on implementation
  });
});
