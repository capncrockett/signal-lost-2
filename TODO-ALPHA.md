# Signal Lost: Agent Alpha TODO List

## Agent Alpha Responsibilities

- Feature development
- Unit tests
- Core functionality implementation
- Releasing develop to main

## Current Tasks

### High Priority

- [ ] Create additional levels showcasing the new puzzle types
- [ ] Fix menu system keyboard navigation issues (identified in E2E tests)
  - Keyboard focus indicators are not visible in menus
  - Arrow key navigation between menu items is inconsistent
  - ESC key doesn't reliably return to previous menu
- [ ] Fix menu system rendering in CI environment
  - Menu text is not properly detected in E2E tests
  - Menu buttons are not properly detected in E2E tests
  - Ensure consistent rendering between local and CI environments
  - Add proper scene key identifiers for menu, levelSelect, and settings scenes

### Medium Priority

- [ ] Implement save game functionality
- [ ] Add sound effects for puzzle interactions
- [ ] Enhance player movement animations

### Low Priority

- [ ] Optimize asset loading for faster startup
- [ ] Add more visual feedback for puzzle interactions

## Completed Tasks

- [x] Add menu system with main menu, level select, and settings screens (PR #9)
- [x] Add new puzzle types: switches, doors, keys, and teleporters (PR #6)
- [x] Fix TypeScript errors and simplify CI workflow (PR #13)

## Development Guidelines

1. Always create feature branches from `develop`, never from `main`
2. Follow the established branching pattern: `feature/alpha/*`
3. Ensure all unit tests pass before submitting PRs
4. Keep the TypeScript configuration consistent between local development and CI
5. Document API changes in the README
