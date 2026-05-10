import { test, expect } from '@playwright/test';
import { ai } from 'passmark';

test.describe('Authentication and Onboarding Flow', () => {

  test('User can successfully sign in and reach the welcome screen', async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Click on Get Started button');
    await ai(page, 'Fill "test@example.com" into email field');
    await ai(page, 'Fill "password123" into password field');
    await ai(page, 'Click the "Sign In" button');
    await expect(page.getByText('Ready to scale your brand?')).toBeVisible();
  });

  test('User can toggle between Login and Signup', async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Go to the authentication page');
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await ai(page, 'Click on "Create an account"');
    await expect(page.getByText('Create Account')).toBeVisible();
    await ai(page, 'Click on "Sign in to existing account"');
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('User can successfully sign out and return to landing', async ({ page }) => {
    await page.goto('/');
    await ai(page, 'Proceed through auth to welcome screen');
    await expect(page.getByText('Ready to scale your brand?')).toBeVisible();
    await ai(page, 'Click on the brand logo to go back to welcome');
    await expect(page.getByText('Ready to scale your brand?')).toBeVisible();
  });

});
