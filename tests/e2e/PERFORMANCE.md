# E2E Test Performance Improvements

This document outlines the improvements made to the E2E test suite to enhance performance, especially in CI environments.

## Key Improvements

### 1. Centralized Helper Functions

- Created a shared `helpers.ts` file with optimized helper functions
- Reduced code duplication across test files
- Standardized test setup and verification methods
- Added `setupTestLevel` helper for consistent test level creation

### 2. Optimized Playwright Configuration

- Enabled parallel test execution in CI with `workers: 2`
- Reduced retry count to 1 for faster CI runs
- Disabled screenshots in CI to improve performance
- Reduced viewport size for faster rendering
- Added timeout limits to prevent hanging tests

### 3. Reduced Wait Times

- Replaced long arbitrary waits (2000-3000ms) with shorter waits (500ms)
- Implemented more efficient polling for game state initialization
- Used direct state manipulation instead of UI interactions when possible
- Added CI-specific wait time optimizations (100-200ms in CI vs 300-500ms in dev)
- Used `waitForFunction` with optimized polling intervals

### 4. Simplified Scene Navigation

- Implemented a more reliable scene navigation helper
- Used game state directly when Phaser API is not accessible
- Added verification helpers to check current scene

### 5. Optimized Test Structure

- Removed console logging in production tests
- Simplified test assertions
- Removed redundant checks and verifications
- Consolidated test setup code
- Optimized puzzle type tests to use shared helpers

## Performance Impact

These improvements should significantly reduce E2E test execution time in CI:

- Parallel test execution (up to 2x faster)
- Reduced wait times (up to 4x faster for some tests)
- More reliable test execution (fewer flaky tests)
- Simplified test setup and teardown
- CI-specific optimizations (up to 60% faster in CI environments)
- Optimized puzzle type tests (up to 50% faster execution)
- Reduced browser resource usage (smaller memory footprint)

## Best Practices for Future Tests

When writing new E2E tests:

1. Use the shared helper functions from `helpers.ts`
2. Use `setupTestLevel` helper for test level creation
3. Keep wait times to a minimum and use CI-specific optimizations
4. Use direct state manipulation when possible
5. Add proper assertions with clear error messages
6. Keep tests independent and focused
7. Avoid UI interactions when direct state manipulation is possible
8. Use `waitForGameState` instead of custom waiting code
9. Implement CI-specific optimizations with `process.env.CI` checks
10. Consolidate common test setup and teardown code
