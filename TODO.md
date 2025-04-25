# Signal Lost: TODO List

## Current State (After PR Merges)

### ✅ Successfully Merged PRs

- PR #9: Add menu system with main menu, level select, and settings screens
- PR #6: Add new puzzle types: switches, doors, keys, and teleporters
- PR #13: Fix TypeScript errors and simplify CI workflow
- PR #16: Fix E2E tests to work with the new menu system
- PR #17: Add documentation for the menu system
- PR #18: Add E2E tests for puzzle types

### ✅ Passing Checks
- Unit Tests: All unit tests are passing
- TypeScript Build: No TypeScript errors
- Linting: All linting checks pass
- Formatting: All formatting checks pass

### ✅ All Issues Resolved

- E2E Tests: All E2E tests are now passing
  - ✅ Fixed canvas element detection
  - ✅ Ensured GAME_STATE global variable is properly set up
  - ✅ Fixed issues with accessing the level property in the GAME_STATE

## Next Steps

### High Priority

- [x] Fix E2E tests to work with the new codebase structure
  - ✅ Updated tests to handle the menu system
  - ✅ Ensured GAME_STATE is properly initialized before tests run
  - ✅ Added proper waiting mechanisms for game initialization

### Medium Priority

- [x] Improve test coverage for new puzzle types
  - ✅ Added E2E tests for blocks and targets
  - ✅ Added E2E tests for switches and doors
  - ✅ Added E2E tests for keys and locked doors
  - ✅ Added E2E tests for teleporters
- [x] Add documentation for the menu system
  - ✅ Created comprehensive menu system documentation
  - ✅ Added documentation for scene structure and navigation
  - ✅ Added documentation for UI components and keyboard navigation
  - ✅ Added documentation for extending the menu system
- [ ] Create additional levels showcasing the new puzzle types

### Low Priority
- [ ] Optimize asset loading for faster startup
- [ ] Improve error handling and debugging tools
- [ ] Add more visual feedback for puzzle interactions

## Development Guidelines

1. Always create feature branches from `develop`, never from `main`
2. Follow the established branching pattern: `feature/alpha/*` or `feature/beta/*`
3. Ensure all tests pass before merging PRs
4. Keep the TypeScript configuration consistent between local development and CI
5. Document API changes in the README

## CI/CD Improvements

- Updated .gitignore to exclude test results and reports
- Ensured consistent TypeScript checking between local and CI environments
- Simplified E2E test configuration for more reliable CI runs
