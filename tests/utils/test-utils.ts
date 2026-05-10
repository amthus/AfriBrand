import { Page, expect } from '@playwright/test';
import { ai } from 'passmark';

/**
 * Common AI-powered interaction utility
 */
export async function performAiStep(page: Page, step: string) {
  console.log(`[AI Step]: ${step}`);
  return await ai(page, step);
}

/**
 * Verifies the app is on a specific step (based on AfriBrand UI)
 */
export async function assertAppStep(page: Page, stepTitle: string) {
  // AfriBrand AI usually has headings for steps
  await expect(page.getByText(stepTitle, { exact: false })).toBeVisible();
}

/**
 * Handles the "Analysis" waiting state
 */
export async function waitForAnalysis(page: Page) {
  await page.waitForSelector('text="Extracting Brand Identity"', { timeout: 30000 });
  await page.waitForSelector('text="Analysis Complete"', { timeout: 30000 });
}
