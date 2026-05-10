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
    await expect(page.getByText('member@example.com')).toBeVisible();
    await ai(page, 'Verify the activity log shows the invitation');
  });

  test('Admin can update brand guidelines (DNA)', async ({ page }) => {
    await ai(page, 'Switch to the Guidelines tab');
    await ai(page, 'Change the first brand color to #FF5733');
    await ai(page, 'Add a new font family "Montserrat"');
    await ai(page, 'Update the Brand Voice description to "Confident and bold"');
    await expect(page.getByText('Confident and bold')).toBeVisible();
  });

  test('Role switching and restricted actions', async ({ page }) => {
    await ai(page, 'Switch my role to Viewer');
    await ai(page, 'Verify that the Invite button is now disabled or hidden');
  });

});
