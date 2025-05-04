# Scripts

This directory contains utility scripts for the Signal Lost project.

## Available Scripts

### `check-typescript.sh`

Checks for TypeScript errors in the codebase using the same strict configuration as the CI environment. This script explicitly uses the main `tsconfig.json` file to ensure consistency between local development and CI.

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

### `monitor-deployment.js`

Monitors the GitHub Pages deployment and checks for common issues, such as:

- Site accessibility
- Required files availability
- Correct MIME types
- Latest deployment status

This script is useful for verifying that the GitHub Pages deployment is working correctly.

Usage:

```bash
npm run deploy:monitor
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
