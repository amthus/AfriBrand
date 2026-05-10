# Passmark AI Testing Guide: AfriBrand AI

This guide explains how to use, maintain, and extend the AI-powered regression testing suite built with **Passmark** and **Playwright**.

## 🧠 What is Passmark?

Passmark is an AI-native wrapper for Playwright. Instead of manually finding CSS selectors (which break frequently), you describe the intended action in natural language. Passmark uses an LLM (typically OpenAI) to translate that intent into stable Playwright actions.

## 🚀 Quick Start

### 1. Requirements
- Node.js environment
- OpenAI API Key (Saved in `.env`)

### 2. Installation
The environment is already pre-configured, but if you are running locally:
```bash
npm install
npx playwright install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and add your key:
```bash
OPENAI_API_KEY=sk-your-key-here
BASE_URL=http://localhost:3000
```

## 🧪 Writing AI Tests

AI tests are located in `tests/ai/`. A typical test looks like this:

```typescript
import { test } from '@playwright/test';
import { ai } from 'passmark';

test('New Feature Workflow', async ({ page }) => {
  await page.goto('/');
  
  // High-level natural language steps
  await ai(page, 'Sign in with user@example.com');
  await ai(page, 'Open the settings and change the brand color to blue');
  await ai(page, 'Verify that the preview logo is now blue');
});
```

### Best Practices for AI Steps
1.  **Be Explicit**: Instead of "Click the button", use "Click the 'Generate' button".
2.  **Wait for Transitions**: If a step triggers a long loading state, you can add `await ai(page, 'Wait for the analysis to complete')`.
3.  **Combine with Standard Assertions**: Use standard `expect(page).toHaveURL()` or `expect(locator).toBeVisible()` alongside AI steps for maximum reliability.

## 🛠️ Configuration

### Playwright Config (`playwright.config.ts`)
The configuration is set up to:
- Run tests in parallel.
- Automatically start the development server.
- Capture traces and videos on failure.
- Support Desktop and Mobile viewports.

### Type Support (`tests/passmark.d.ts`)
Since Passmark is a bleeding-edge library, we've included a custom declaration file to ensure `tsc` doesn't complain about missing types.

## 🏃 Running Tests

```bash
# Run all tests in headless mode
npm test

# Open the Playwright UI (Highly recommended for debugging AI steps)
npm run test:ui

# View the last test report
npm run test:report
```

## 🔍 Troubleshooting

### "AI step failed to find element"
- **Check the UI**: Did the app change significantly?
- **Be more descriptive**: Update the instruction in `ai()` to be more specific about the element's location or labels.
- **Check API Quota**: Ensure your `OPENAI_API_KEY` has active credit.

### "Lint errors on 'ai' import"
- Ensure `tests/passmark.d.ts` is present in your project.
- Check that `include` in `tsconfig.json` covers the `tests` directory.

---
*Built for the Breaking Apps Hackathon 2024.*
