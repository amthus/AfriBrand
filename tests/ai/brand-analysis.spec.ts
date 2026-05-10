import { test, expect } from '@playwright/test';
import { ai } from 'passmark';

test.describe('Brand DNA and Campaign Generation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Navigate through landing and sign in');
  });

  test('User can start brand analysis with business details', async ({ page }) => {
    await ai(page, 'Enter "AfriStore" as business name');
    await ai(page, 'Enter "Handmade African crafts and jewelry" as business description');
    await ai(page, 'Select "Nigeria" as the country');
    await ai(page, 'Check "Yoruba" as a preferred language');
    await ai(page, 'Click the "Start Brand Analysis" button');
    await ai(page, 'Wait for the Brand DNA analysis to finish');
    await expect(page.getByText('Brand DNA Extraction')).toBeVisible();
    await expect(page.getByText('AfriStore')).toBeVisible();
  });

  test('User can generate campaign ideas after analysis', async ({ page }) => {
    await ai(page, 'Analyze brand for a coffee shop in Ethiopia');
    await ai(page, 'Click "Generate Marketing Ideas"');
    await ai(page, 'Wait for campaign ideas to load');
    await expect(page.getByText('Suggested Campaigns')).toBeVisible();
    await ai(page, 'Verify that there are multiple campaign cards displayed');
  });

  test('User can generate more ideas and custom campaigns', async ({ page }) => {
    await ai(page, 'Analyze brand for a tech startup in Lagos');
    await ai(page, 'Click "Generate Marketing Ideas"');
    await ai(page, 'Click on "Explore More Hooks"');
    await ai(page, 'Wait for more ideas to appear');
    await ai(page, 'Enter "Launch of a new delivery app" into custom prompt field');
    await ai(page, 'Click "Generate Custom Strategy"');
    await ai(page, 'Verify "Launch of a new delivery app" is now in the list');
  });

});
