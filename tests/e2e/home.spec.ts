import { test, expect } from '@playwright/test';

// Basic smoke tests for landing page structure

test.describe('Home Page', () => {
  test('loads hero and headline text', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /ZeroDay Arcade,/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Try It Out/i })).toBeVisible();
  });

  test('navbar has expected nav links & CTAs (desktop)', async ({ page }, testInfo) => {
    // Skip for mobile project profiles
    if (/mobile/i.test(testInfo.project.name)) test.skip(true, 'Desktop nav hidden on mobile project');
    await page.goto('/');
    const navLinks = ['Scenarios', 'Features', 'Leagues', 'Team', 'Contact'];
    for (const label of navLinks) {
      await expect(page.getByRole('link', { name: label })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: /Join Up/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Login/i })).toBeVisible();
  });

  test('mobile menu opens and shows nav links', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Firefox mobile emulation differences not critical for smoke');
    await page.goto('/');
    await page.setViewportSize({ width: 480, height: 800 });
    // Mobile should hide desktop nav
    const scenariosLink = page.getByRole('link', { name: 'Scenarios' });
    await expect(scenariosLink).toBeHidden();
    // Open sheet
    await page.getByRole('button', { name: /toggle menu/i }).click();
    await expect(page.getByRole('link', { name: 'Team' })).toBeVisible();
  });
});
