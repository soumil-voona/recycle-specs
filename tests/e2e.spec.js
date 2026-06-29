import { test, expect } from '@playwright/test';

test.describe('RecycleSpecs E2E Tests', () => {
  test('should load the homepage and check title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Recycle Specs/i);
    // Wait for the hero section to load
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should navigate to Upcoming Events page', async ({ page }) => {
    await page.goto('/');
    // Click the Upcoming button in the navbar
    await page.getByRole('button', { name: 'Upcoming' }).click();
    await expect(page).toHaveURL(/\/upcoming/);
    await expect(page.locator('h1', { hasText: 'Upcoming' }).first()).toBeVisible();
  });

  test('should show login form when navigating to /login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1', { hasText: 'Log In' }).first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show signup form when navigating to /signup', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('h1', { hasText: 'Join Us' }).first()).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible(); // First Name
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
