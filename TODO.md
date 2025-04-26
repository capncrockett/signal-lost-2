# Signal Lost: TODO Documentation

> **Note**: The TODO list has been reorganized into agent-specific files for better task management.

## New TODO Structure

The project now uses the following TODO files:

1. **[TODO-HIGH-LEVEL.md](./TODO-HIGH-LEVEL.md)** - High-level project status and roadmap

   - Only to be updated by Agent Alpha
   - Contains overall project status, roadmap, and CI/CD status

2. **[TODO-ALPHA.md](./TODO-ALPHA.md)** - Tasks for Agent Alpha

   - Feature development
   - Unit tests
   - Core functionality implementation
   - Releasing develop to main

3. **[TODO-BETA.md](./TODO-BETA.md)** - Tasks for Agent Beta
   - Quality assurance
   - Documentation
   - E2E tests
   - Linting and formatting
   - Reviewing and approving releases

## Task Management Guidelines

1. Each agent should focus on their respective TODO file
2. Only Agent Alpha should update the high-level TODO file
3. When completing tasks, mark them as done in the appropriate TODO file
4. Follow the established branching pattern: `feature/alpha/*` or `feature/beta/*`
5. Always create feature branches from `develop`, never from `main`
6. Ensure all tests pass before merging PRs

## Legacy Information

This file has been replaced by the new structure above. Please refer to the agent-specific TODO files for current tasks and status.
