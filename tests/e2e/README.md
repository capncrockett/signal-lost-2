# 🧪 Signal Lost E2E Tests

This directory contains end-to-end tests for the Signal Lost game using Playwright.

## 🛠️ Test Structure

- `game.spec.ts`: Tests for core game functionality (loading, controls, UI)
- `puzzle.spec.ts`: Tests for puzzle mechanics and game state
- `puzzleTypes.spec.ts`: Tests for basic puzzle types (blocks, switches, keys, teleporters)
- `advancedPuzzles.spec.ts`: Tests for advanced puzzle types (pressure plates, timed doors)
- `menuSystem.spec.ts`: Tests for menu navigation and functionality
- `helpers.ts`: Common test utilities and helper functions

## 🚀 Running Tests

### For Development (with HTML Report)

```bash
npm run test:e2e
```

This will run the tests and generate an HTML report that you can view in your browser.

### For Agents (without HTML Report)

```bash
npm run test:e2e:agent
```

This will run the tests with a simple list reporter that outputs results to the console.

### Viewing Test Results

After running tests with the agent configuration, you can parse and view the results:

```bash
npm run test:e2e:report
```

This will display a summary of the test results, including any failures.

## 📝 Writing Tests

When writing E2E tests, follow these guidelines:

1. **Test from the user's perspective**: Focus on what the user sees and interacts with
2. **Use page objects**: Create page objects for complex UI elements
3. **Keep tests independent**: Each test should be able to run on its own
4. **Use descriptive test names**: Names should describe what the test is verifying
5. **Add comments**: Explain what each section of the test is doing

## 🔄 CI Integration

The E2E tests are integrated into the CI pipeline and run on every pull request. Test results are saved as artifacts and can be downloaded from the GitHub Actions workflow.

## 🧩 Test Helpers

The `helpers.ts` file provides common utilities for E2E tests:

- `wait(ms)`: A helper function to wait for a specified number of milliseconds
- `waitForGameState(page)`: Waits for the game state to be initialized
- `navigateToGame(page)`: Navigates from the menu to the game scene
- `setupTestLevel(page, entities)`: Sets up a test level with specific entities
- `page.evaluate()`: Used to access the game state and trigger game events
