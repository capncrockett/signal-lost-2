# Scripts

This directory contains utility scripts for the Signal Lost project.

## Available Scripts

### `check-typescript.sh`

Checks for TypeScript errors in the codebase using the same strict configuration as the CI environment.

Usage:
```bash
npm run type-check:ci
```

### `parse-test-results.js`

Parses the JSON test results from Playwright E2E tests and outputs a summary.

Usage:
```bash
npm run test:e2e:report
```

### `deploy.sh`

Triggers the GitHub Actions workflow to deploy the game to GitHub Pages.

Usage:
```bash
./scripts/deploy.sh v1.0.0
```

## Best Practices

1. **Run TypeScript checks before committing code**:
   ```bash
   npm run pre-commit
   ```
   This will run TypeScript type checking, ESLint, and Prettier to ensure your code meets the project's quality standards.

2. **Make scripts executable**:
   ```bash
   chmod +x scripts/*.sh
   ```
   This ensures that shell scripts can be executed directly.

3. **Document new scripts**:
   Add documentation for any new scripts you create to this README file.
