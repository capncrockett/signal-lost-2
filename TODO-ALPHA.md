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

### Medium Priority

- [ ] Implement save game functionality
- [ ] Add sound effects for puzzle interactions
- [ ] Enhance player movement animations
- [ ] Fix level select screen to properly display available levels
- [ ] Ensure settings menu audio controls are properly connected to game state

### Low Priority

- [ ] Optimize asset loading for faster startup
- [ ] Add more visual feedback for puzzle interactions
- [ ] Improve debug overlay visibility and reliability for testing

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
