import { test, expect } from '@playwright/test';
import { ai } from 'passmark';

test.describe('Asset Generation and Creative Studio', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Reach the Campaign Planner stage for a fashion brand');
  });

  test('User can generate assets for a specific campaign', async ({ page }) => {
    await ai(page, 'Select the first campaign from the list');
    
    // Assert transition to Asset Generator
    await ai(page, 'Wait for assets to generate');
    await expect(page.getByText('Asset Generator')).toBeVisible();
    
    // Check asset cards
    await ai(page, 'Verify assets for Instagram and Facebook are generated');
  });

  test('User can edit a generated asset', async ({ page }) => {
    await ai(page, 'Select the first campaign and wait for assets');
    await ai(page, 'Click on edit button for the first asset');
    
    // Assert transition to Editor
    await expect(page.getByText('Creative Asset Editor')).toBeVisible();
    
    // AI Editing
    await ai(page, 'Change the headline to "Authentic African Style"');
    await ai(page, 'Click the Save button');
    
    // Back to assets and verify
    await ai(page, 'Go back to asset view');
    await expect(page.getByText('Authentic African Style')).toBeVisible();
  });

  test('User can open and use Creative Studio', async ({ page }) => {
    await ai(page, 'Select the first campaign and wait for assets');
    await ai(page, 'Open the AI Creative Studio');
    
    await expect(page.getByText('Creative Studio')).toBeVisible();
    
    await ai(page, 'Enter "A minimalist poster for my summer collection" into the studio prompt');
    await ai(page, 'Click Generate');
    await ai(page, 'Wait for the new asset to appear');
  });

  test('User can export assets as ZIP', async ({ page }) => {
    await ai(page, 'Select the first campaign and wait for assets');
    
    // Test the export button
    const downloadPromise = page.waitForEvent('download');
    await ai(page, 'Click on Export All (ZIP) button');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.zip');
  });

});
