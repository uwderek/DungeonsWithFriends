import { test, expect } from '@playwright/test';

test('App should load without crashing', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Open up App.tsx to start working on your app!')).toBeVisible();
});
