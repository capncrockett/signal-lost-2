# TypeScript Configuration Guide

This document explains the TypeScript configuration for the Signal Lost project and provides guidance on maintaining strict type checking across all environments.

## Configuration

The project uses strict TypeScript checking in both local development and CI environments to ensure high code quality:

- `noUnusedLocals: true`: Reports errors for unused local variables
- `noUnusedParameters: true`: Reports errors for unused function parameters
- `noImplicitReturns: true`: Ensures all code paths in a function return a value

## Maintaining Consistency

It's important that the local development environment matches the CI environment exactly. This helps catch issues early in the development process and prevents surprises when code is pushed to the repository.

The project has been configured to ensure that the same TypeScript checks are applied in both local development and CI environments. The `tsconfig.dev.json` file has been removed to enforce consistent TypeScript checking across all environments.

## NPM Scripts

- `npm run build`: Production build with strict TypeScript checking using the main `tsconfig.json`
- `npm run build:check`: Type-check and build with strict rules (used in CI) using the main `tsconfig.json`
- `npm run type-check`: Run TypeScript type checking with strict rules using the main `tsconfig.json`
- `npm run type-check:ci`: Run TypeScript type checking with the same strict rules as CI

## Best Practices

1. **Run TypeScript type checking locally before pushing code**:

   ```bash
   npm run type-check
   ```

2. **Fix all TypeScript errors before creating a PR**:

   - This prevents CI failures and streamlines the review process
   - It also helps catch issues early in the development process

3. **Common TypeScript errors and how to fix them**:

   - **Unused variables**: Either use the variable or remove it

   ```typescript
   // Error
   function example() {
     const unused = 'value' // Error: 'unused' is declared but never used
     return 'result'
   }

   // Fixed
   function example() {
     return 'result'
   }
   ```

   - **Unused parameters**: Either use the parameter or prefix it with an underscore

   ```typescript
   // Error
   function process(data: string, options: object) {
     // Error: 'options' is declared but never used
     return data.toUpperCase()
   }

   // Fixed (option 1: remove the parameter)
   function process(data: string) {
     return data.toUpperCase()
   }

   // Fixed (option 2: prefix with underscore)
   function process(data: string, _options: object) {
     return data.toUpperCase()
   }
   ```

4. **When to use `// @ts-ignore` or `// @ts-expect-error`**:

   - Only use these comments for legitimate cases where TypeScript's type system cannot correctly model the code
   - Always add a comment explaining why the TypeScript error is being suppressed
   - Prefer refactoring the code to be type-safe over suppressing errors

5. **Use IDE TypeScript integration**:
   - Configure your IDE to show TypeScript errors in real-time
   - This provides immediate feedback during development

## CI Environment

The CI environment runs the following command to check for TypeScript errors:

```bash
npm run build:check
```

This command runs `tsc --noEmit --project tsconfig.json && vite build`, which performs a full type check with all strict rules enabled before building the project.

The local development environment now uses the exact same TypeScript configuration as the CI environment, ensuring consistency between local development and CI.
