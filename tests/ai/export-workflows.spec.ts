import { test, expect } from '@playwright/test';
import { ai } from 'passmark';

test.describe('Export and Reporting Workflows', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Reach the Campaign Planner stage');
  });

  test('User can export campaign as CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await ai(page, 'Click on Download CSV button');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('User can export campaign as ICS calendar', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await ai(page, 'Click on Export to Calendar button');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.ics');
  });

  test('User can export campaign details as JSON', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await ai(page, 'Select a campaign and click Export JSON');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.json');
  });

});
