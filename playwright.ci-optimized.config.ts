import { defineConfig, devices } from '@playwright/test'

/**
 * Optimized Playwright configuration for CI
 * 
 * This configuration is designed to improve CI performance by:
 * 1. Running tests in parallel (2 workers)
 * 2. Reducing retry attempts to 1
 * 3. Using a more efficient timeout strategy
 * 4. Grouping tests to minimize web server restarts
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Reduced from 2 to 1
  workers: process.env.CI ? 2 : undefined, // Increased from 1 to 2
  timeout: 30000, // 30 seconds timeout per test
  reporter: process.env.CI ? [['json', { outputFile: 'test-results/e2e-results.json' }], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    // Add a shorter navigation timeout
    navigationTimeout: 15000,
    // Add a shorter action timeout
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    // Add timeout for server to be ready
    timeout: 60000, // 60 seconds
    // Add retry for server to be ready
    reuseExistingServer: !process.env.CI,
  },
  // Group tests to minimize server restarts
  shard: process.env.CI ? { total: 1, current: 1 } : undefined,
})
