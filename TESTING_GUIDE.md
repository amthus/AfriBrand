# AfriBrand AI: Comprehensive Testing Guide

This document provides a detailed overview of the regression testing suite for AfriBrand AI, utilizing Playwright and Passmark AI.

## Architecture

Tests are structured into functional modules within the `tests/ai/` directory. Each module uses Passmark to execute high-level user intents.

## Test Suites and Steps

### 1. Authentication Workflow (`auth-workflow.spec.ts`)
Verifies the security and onboarding entry points.
- **Login Flow**:
  1. Navigate to home.
  2. Click Get Started.
  3. Enter credentials (email/password).
  4. Confirm redirect to Welcome dashboard.
- **Signup Toggle**:
  1. Navigate to auth.
  2. Switch to Create Account.
  3. Switch back to Sign In.
- **Logout/Navigation**:
  1. Verify brand logo navigation back to primary dashboard state.

### 2. Brand Analysis and Strategy (`brand-analysis.spec.ts`)
Tests the core AI engine for brand identity extraction.
- **DNA Extraction**:
  1. Submit business name and description.
  2. Select country and language.
  3. Wait for AI analysis.
  4. Assert brand values and colors are extracted.
- **Ideation**:
  1. Start analysis for local business.
  2. Generate marketing campaigns.
  3. Verify multiple campaign cards appear.
- **Expansion**:
  1. Use "Explore More" for additional hooks.
  2. Generate custom strategy via prompt.

### 3. Asset Generation (`asset-management.spec.ts`)
Validates the creative studio and multi-format generation.
- **Generation**:
  1. Select campaign.
  2. Trigger asset generation.
  3. Assert cross-platform assets (IG, FB) are visible.
- **Editor**:
  1. Open visual editor.
  2. Modify headline using AI commands.
  3. Save and verify persistence in asset gallery.
- **Creative Studio**:
  1. Launch full studio.
  2. Generate asset from custom prompt.
- **Bulk Export**:
  1. Trigger "Export All (ZIP)".
  2. Verify download of optimized archive.

### 4. Team and Guidelines (`team-settings.spec.ts`)
Tests collaboration and brand consistency settings.
- **Team Management**:
  1. Invite member via email.
  2. Assign Editor role.
  3. Confirm member appears in roster.
- **Global Guidelines**:
  1. Update brand colors in Guidelines tab.
  2. Update typography.
  3. Set global brand voice.
- **Permissions**:
  1. Switch to Viewer role.
  2. Assert "Invite" functionality is restricted.

### 5. Social Integrations (`social-integrations.spec.ts`)
Verifies connectivity with external platforms.
- **Connection**:
  1. Connect Instagram via OAuth flow.
  2. Verify status change to "Connected".
- **Disconnection**:
  1. Remove Facebook integration.
  2. Verify return to "Connect" state.

### 6. Export Workflows (`export-workflows.spec.ts`)
Tests data portability and scheduling exports.
- **Data Portability**:
  1. Export strategy to CSV.
  2. Export calendar to ICS.
  3. Export full campaign metadata to JSON.

## Execution Guide and Commands

### 1. Environment Preparation
Before execution, ensure all dependencies and browser binaries are provisioned.

**Command:**
```bash
npm install
npx playwright install
```

**Expected Result:**
Installation of all packages listed in package.json including @playwright/test and passmark. Playwright will download the necessary browser binaries (Chromium, Firefox, WebKit).

---

### 2. Standard Test Execution
Runs all test suites in the background (headless mode) across multiple browser projects.

**Command:**
```bash
npm test
```

**Expected Result:**
Terminal output showing the progress of each test file. You should see a summary similar to:
```text
Running 24 tests using 4 workers
  6 passed (45s)
  18 passed (1.2m)

  24 passed (2.1m)

To open last HTML report run:
  npx playwright show-report
```

---

### 3. Interactive UI Mode
Provides a visual interface to watch the AI navigate the application in real-time.

**Command:**
```bash
npm run test:ui
```

**Expected Result:**
A new window opens displaying the Playwright Test runner. 
1. Select a test from the left sidebar.
2. Click the Play button.
3. Observe the "Action" column showing the AI instructions being translated to locator calls.
4. View the snapshots of the application at each step.

---

### 4. Directing Specific Suites
Execute individual modules to isolate verification of specific features.

**Commands:**
```bash
# Auth and Onboarding only
npx playwright test auth-workflow

# Brand DNA and Strategy only
npx playwright test brand-analysis

# Asset Creative Studio only
npx playwright test asset-management
```

**Expected Result:**
Execution focused only on the target files, providing faster feedback for specific feature regressions.

---

### 5. Generating and Viewing Reports
Comprehensive analysis of test performance and failure diagnostics.

**Command:**
```bash
npm run test:report
```

**Expected Result:**
Local web server starts and opens a browser tab showing:
- Pass/Fail status for every test across all browsers.
- Execution time per step.
- Video recordings of the test execution (if configured/failed).
- Trace viewer for deep debugging of AI pathfinding.

---

## Test Matrix and Validation Criteria

| Test Suite | Priority | Expected Outcome | Validation Method |
| :--- | :--- | :--- | :--- |
| Auth Workflow | Critical | User enters dashboard successfully | Assert welcome text presence |
| Brand Analysis | High | AI identifies brand tones and colors | Assert DNA card values |
| Asset Generation | High | Multi-platform images/videos appear | Assert preview container count |
| Team Management | Medium | Roles are correctly enforced | Assert button disabled state |
| Export Systems | Medium | ZIP, CSV, ICS files are generated | Assert download event success |
| Social Sync | Low | Accounts show connected status | Assert connection badge text |

## AI Pathfinding Verification
Passmark performs "Self-Healing". If a test console outputs `[AI Step]: Click the "Sign In" button` and the button is actually labeled "Login" or has moved to a different container, the AI will intelligently identify the correct target. A successful test run with these logs indicates the AI pathfinding is functioning correctly.

## AI Testing Principles
- Intent-based steps via Passmark.
- Native performance via Playwright.
- Auto-healing for dynamic UI components.
- Zero reliance on fragile CSS selectors.
