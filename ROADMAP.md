# Signal Lost: Development Roadmap

This document outlines the development roadmap for Signal Lost, replacing the previous TODO files with a more structured approach.

## 🚀 Current Status

- Project is in POC/MVP phase with modular architecture
- All critical tests are passing
- CI/CD pipeline is functioning correctly
- Menu system and new puzzle types have been implemented
- First release (v0.0.1) has been deployed to GitHub Pages
- GitHub Pages deployment is now working correctly with proper MIME types

## 📊 Development Phases

### Phase 1: Core Gameplay (Completed)

- ✅ Basic player movement
- ✅ Block pushing mechanics
- ✅ Level completion detection
- ✅ Debug overlay for development

### Phase 2: Enhanced Puzzles (Current)

- ✅ Switches and doors
- ✅ Keys and locked doors
- ✅ Teleporters
- 🔄 Additional level designs

### Phase 3: User Experience (In Progress)

- ✅ Menu system
- 🔄 Save game functionality
- 🔄 Sound effects and music
- 🔄 Visual polish

### Phase 4: Content Expansion (Planned)

- 📅 Level editor
- 📅 Community sharing features
- 📅 Additional puzzle elements

## 📝 Agent Responsibilities

### Agent Alpha (Feature Development)

- Implement new features and core functionality
- Write unit tests for all new features
- Fix bugs and issues in the codebase
- Manage releases from develop to main

### Agent Beta (Quality Assurance)

- Ensure code quality and test coverage
- Write and maintain E2E tests
- Update documentation
- Review PRs and approve releases

## 🔍 Current Focus Areas

### Core Gameplay

- Create additional levels showcasing the new puzzle types
- ✅ Fix menu system keyboard navigation issues
- Implement save game functionality
- Add sound effects for puzzle interactions

### Visual and Audio

- Enhance player movement animations
- Add visual feedback for puzzle interactions
- Implement background music
- Create custom pixel art assets

### Technical Improvements

- Optimize asset loading for faster startup
- Improve error handling and debugging tools
- Ensure consistent rendering between local and CI environments
- Optimize E2E test performance in CI

## 🔄 Development Workflow

1. Issues are tracked in GitHub Issues
2. Feature branches follow the pattern: `feature/alpha/*` or `feature/beta/*`
3. All branches are created from `develop`, never from `main`
4. PRs require passing all CI checks before merging
5. Releases are created by merging `develop` to `main`

## 📈 Progress Tracking

Progress is tracked through:

1. GitHub Issues for specific tasks and bugs
2. Pull Requests for feature implementation
3. This ROADMAP.md file for high-level progress
4. The README.md file for user-facing documentation

## 🎮 Deployment

The game is deployed to GitHub Pages using GitHub Actions:

- Current deployment: https://capncrockett.github.io/signal-lost-2/
- Deployment is triggered by merging to the `main` branch
- The deployment process is documented in the README.md file

---

*This roadmap replaces the previous TODO files and provides a more structured approach to tracking development progress.*
