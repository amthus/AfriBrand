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

    // Wait for AI analysis animation and transition
    // Passmark handles the "smart wait" for UI changes
    await ai(page, 'Wait for the Brand DNA analysis to finish');
    
    // Assert DNA result
    await expect(page.getByText('Brand DNA Extraction')).toBeVisible();
    await expect(page.getByText('AfriStore')).toBeVisible();
  });

  test('User can generate campaign ideas after analysis', async ({ page }) => {
    // Skip to DNA stage if possible, or run through
    await ai(page, 'Analyze brand for a coffee shop in Ethiopia');
    await ai(page, 'Click "Generate Marketing Ideas"');

    // Assert Ideation stage
    await ai(page, 'Wait for campaign ideas to load');
    await expect(page.getByText('Suggested Campaigns')).toBeVisible();
    
    // Check if campaigns are listed
    const campaignCards = page.locator('div[id^="card-"]'); // Generic selector for cards
    // AI check for campaign list
    await ai(page, 'Verify that there are multiple campaign cards displayed');
  });

  test('User can generate more ideas and custom campaigns', async ({ page }) => {
    await ai(page, 'Analyze brand for a tech startup in Lagos');
    await ai(page, 'Click "Generate Marketing Ideas"');
    
    // Test "Explore More"
    await ai(page, 'Click on "Explore More Hooks"');
    await ai(page, 'Wait for more ideas to appear');
    
    // Test Custom Campaign
    await ai(page, 'Enter "Launch of a new delivery app" into custom prompt field');
    await ai(page, 'Click "Generate Custom Strategy"');
    await ai(page, 'Verify "Launch of a new delivery app" is now in the list');
  });

});
