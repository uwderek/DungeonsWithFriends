import { test, expect } from '@playwright/test';

test('App should load without crashing', async ({ page }) => {
    // Capture browser console logs
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });

    console.log('[E2E:App] Navigating to index route...');
    await page.goto('/');

    console.log('[E2E:App] Asserting default local dashboard visibility...');
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
    await expect(page.locator('text=Characters').first()).toBeVisible();

    console.log('[E2E:App] Load confirmed successful.');
});
