import { test, expect } from '@playwright/test';

test('App should load without crashing', async ({ page }) => {
    // Capture browser console logs
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });

    console.log('[E2E:App] Navigating to index route...');
    await page.goto('/');

    console.log('[E2E:App] Asserting default welcome text visibility...');
    // Updated to match actual WelcomeScreen content
    await expect(page.locator('text=DUNGEONS')).toBeVisible();
    await expect(page.locator('text=With Friends')).toBeVisible();

    console.log('[E2E:App] Load confirmed successful.');
});
