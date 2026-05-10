import { test, expect } from '@playwright/test';
import { ai } from 'passmark';

test.describe('Brand Settings and Team Management', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Navigate to the dashboard settings page');
  });

  test('Admin can invite a new team member', async ({ page }) => {
    await expect(page.getByText('Brand Settings & Team')).toBeVisible();
    
    await ai(page, 'Enter "member@example.com" into the invite email field');
    await ai(page, 'Select "Editor" as the role');
    await ai(page, 'Click the Invite button');
    
    // Verify invitation in table and activity log
    await expect(page.getByText('member@example.com')).toBeVisible();
    await ai(page, 'Verify the activity log shows the invitation');
  });

  test('Admin can update brand guidelines (DNA)', async ({ page }) => {
    await ai(page, 'Switch to the Guidelines tab');
    
    // Update brand colors
    await ai(page, 'Change the first brand color to #FF5733');
    await ai(page, 'Add a new font family "Montserrat"');
    
    // Update brand voice
    await ai(page, 'Update the Brand Voice description to "Confident and bold"');
    
    // Verify changes persist or shown
    await expect(page.getByText('Confident and bold')).toBeVisible();
  });

  test('Role switching and restricted actions', async ({ page }) => {
    // Note: App has a mock role switcher in settings
    await ai(page, 'Switch my role to Viewer');
    
    // Verify some buttons are disabled or hidden for Viewers
    // For example, Viewer shouldn't see "Invite" button or it should be disabled
    await ai(page, 'Verify that the Invite button is now disabled or hidden');
  });

});
