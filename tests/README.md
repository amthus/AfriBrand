# Passmark AI Regression Testing for AfriBrand AI

## 🚀 Project Overview
This repository contains a full-scale AI-powered regression testing suite for **AfriBrand AI**, an enterprise SaaS platform for African SMEs. By leveraging **Playwright** and **Passmark**, we've built a testing infrastructure that understands natural language and can intelligently navigate complex AI-driven workflows.

## 🧠 Why AI Regression Testing Matters
Traditional end-to-end tests are fragile. A simple UI change (like changing a button's padding or text from "Sign In" to "Login") can break dozens of tests. 
AI regression testing allows:
- **Resilience**: Tests focus on intent, not fragile CSS selectors.
- **Speed**: Describe a test in one sentence; let the AI find the path.
- **Maintainability**: Reduced "test rot" as the UI evolves.

## 🛠️ How Passmark Works
Passmark bridges the gap between natural language and browser automation.
1. **Natural Language Steps**: We define what we want to do (e.g., "Analyze brand for a coffee shop").
2. **AI Reasoning**: Passmark analyzes the DOM and determines the best Playwright actions to achieve the goal.
3. **Execution**: Playwright executes the steps at native speed.

## 📂 Architecture
```text
tests/
├── ai/              # AI-powered test suites (Passmark)
├── e2e/             # Standard Playwright sanity checks
├── utils/           # Shared test helpers and AI step wrappers
└── playwright.config.ts # Global configuration
```

## ⚙️ Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   npx playwright install
   ```

2. **Environment Configuration**
   Create a `.env` file based on `.env.example`:
   ```bash
   OPENAI_API_KEY=sk-...
   BASE_URL=http://localhost:3000
   ```

3. **Run Tests**
   ```bash
   # Run all tests
   npm test
   
   # Run with UI mode
   npm run test:ui
   ```

## 📈 Test Coverage
- **Auth Systems**: Login, Signup, Role-switching.
- **Core Engine**: Brand DNA analysis, Campaign generation.
- **Creative Studio**: Asset editing, magic generation, video ads.
- **Operations**: Team invitations, guidelines updates, data exports.

## 💡 Lessons Learned
- **Prompt Engineering for Testing**: Writing clear test steps is as important as writing clear code.
- **Handling Non-Deterministic UI**: AI tests excel at handling slightly different UI states across different environments.
- **Scaling**: Using reusable utility functions for common AI flows significantly speeds up development.

## 🔮 Future Improvements
- **Visual Regression**: Integrating AI visual diffing to detect styling anomalies.
- **Multi-Model Consensus**: Running assertions across multiple LLMs to minimize false positives.
- **Autonomous Exploration**: Letting the AI "explore" the app to find edge-case crashes automatically.
