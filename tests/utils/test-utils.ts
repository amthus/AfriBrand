import { Page, expect } from '@playwright/test';
import { ai } from 'passmark';

export async function performAiStep(page: Page, step: string) {
  console.log(`[AI Step]: ${step}`);
  return await ai(page, step);
}

export async function assertAppStep(page: Page, stepTitle: string) {
  await expect(page.getByText(stepTitle, { exact: false })).toBeVisible();
}

export async function waitForAnalysis(page: Page) {
  await page.waitForSelector('text="Extracting Brand Identity"', { timeout: 30000 });
  await page.waitForSelector('text="Analysis Complete"', { timeout: 30000 });
}
