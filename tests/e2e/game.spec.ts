import { test, expect } from '@playwright/test'

test('game loads and canvas is visible', async ({ page }) => {
  await page.goto('/')
  
  // Check that the canvas is created
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
})
