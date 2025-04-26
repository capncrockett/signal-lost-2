import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Allow parallel execution in CI with a limited number of workers
  workers: process.env.CI ? 2 : undefined,
  // Use 'list' reporter instead of 'html' for agent use
  reporter: process.env.CI ? [['json', { outputFile: 'test-results/e2e-results.json' }], ['list']] : 'list',
  // Shorter global timeout for CI
  timeout: process.env.CI ? 30000 : 60000,
  use: {
    baseURL: 'http://localhost:8000',
    // Only collect traces on CI failures to improve performance
    trace: process.env.CI ? 'on-first-retry' : 'on-first-retry',
    // Reduce viewport size for faster rendering
    viewport: { width: 800, height: 600 },
    // Disable screenshots on failure to improve performance
    screenshot: process.env.CI ? 'off' : 'only-on-failure',
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
    // Reduce timeout for webserver startup
    timeout: 60000,
  },
})
