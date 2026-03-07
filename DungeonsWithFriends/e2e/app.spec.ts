import { test, expect } from '@playwright/test';

test('App should load without crashing', async ({ page }) => {
    console.log('[E2E:App] Navigating to index route...');
    await page.goto('/');

    console.log('[E2E:App] Asserting default welcome text visibility...');
    await expect(page.locator('text=Open up App.tsx to start working on your app!')).toBeVisible();

    console.log('[E2E:App] Load confirmed successful.');
});
