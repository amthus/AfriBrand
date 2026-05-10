import { test, expect } from '@playwright/test';
import { ai } from 'passmark';

test.describe('Social Media Integrations', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Navigate to brand settings integrations tab');
  });

  test('User can connect Instagram account', async ({ page }) => {
    await ai(page, 'Click on connect Instagram button');
    await expect(page.getByText('Connected', { exact: true }).first()).toBeVisible();
  });

  test('User can disconnect Facebook account', async ({ page }) => {
    await ai(page, 'Click on disconnect Facebook button');
    await expect(page.getByText('Connect Facebook')).toBeVisible();
  });

  test('User can see connection status for all platforms', async ({ page }) => {
    await ai(page, 'Verify that Instagram, Facebook, and WhatsApp connection cards are visible');
  });

});
