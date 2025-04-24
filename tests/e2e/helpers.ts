import { Page, expect } from '@playwright/test'

/**
 * Helper functions for E2E tests
 */

/**
 * Wait for the game to initialize
 * This ensures that the GAME_STATE is available and the canvas is visible
 */
export async function waitForGameInitialization(page: Page): Promise<void> {
  // Wait for the canvas to be visible
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 5000 })

  // Wait for GAME_STATE to be available
  await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })
}

/**
 * Navigate to the game scene from the main menu
 * This handles the menu navigation to start the game
 */
export async function navigateToGameScene(page: Page, levelId = 'start'): Promise<void> {
  // Wait for the game to initialize
  await waitForGameInitialization(page)

  // Check if we're already in a game scene
  const inGameScene = await page
    .evaluate(() => {
      return window.GAME_STATE && window.GAME_STATE.level && window.GAME_STATE.level.id !== undefined
    })
    .catch(() => false)

  if (inGameScene) {
    console.log('Already in game scene, skipping navigation')
    return
  }

  // Set the level directly via game state
  await page.evaluate(id => {
    // If we can't find the menu, set the level directly
    window.GAME_STATE.loadLevel(id)
  }, levelId)

  // Wait for the game scene to initialize
  await page.waitForFunction(
    id => window.GAME_STATE && window.GAME_STATE.level && window.GAME_STATE.level.id === id,
    { timeout: 5000 },
    levelId
  )
}

/**
 * Navigate to a specific level from the main menu
 */
export async function navigateToLevel(page: Page, levelId: string): Promise<void> {
  // Wait for the game to initialize
  await waitForGameInitialization(page)

  // Set the level directly via game state
  await page.evaluate(id => {
    // If we can't find the menu, set the level directly
    window.GAME_STATE.loadLevel(id)
  }, levelId)

  // Wait for the game scene to initialize with the selected level
  await page.waitForFunction(
    id => window.GAME_STATE && window.GAME_STATE.level && window.GAME_STATE.level.id === id,
    { timeout: 5000 },
    levelId
  )
}

/**
 * Get the current value of a property from the game state
 */
export async function getGameStateProperty<T>(page: Page, propertyPath: string): Promise<T> {
  return page.evaluate(path => {
    // Split the path into parts (e.g., "level.id" -> ["level", "id"])
    const parts = path.split('.')

    // Start with the GAME_STATE
    let value: any = window.GAME_STATE

    // Navigate through the property path
    for (const part of parts) {
      if (value === undefined || value === null) {
        throw new Error(`Property path ${path} is invalid at ${part}`)
      }
      value = value[part]
    }

    return value as T
  }, propertyPath)
}

/**
 * Set a value in the game state
 */
export async function setGameStateProperty(page: Page, propertyPath: string, value: any): Promise<void> {
  await page.evaluate(
    ({ path, val }) => {
      // Split the path into parts (e.g., "level.id" -> ["level", "id"])
      const parts = path.split('.')

      // Start with the GAME_STATE
      let obj: any = window.GAME_STATE

      // Navigate through the property path to the parent object
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (obj === undefined || obj === null) {
          throw new Error(`Property path ${path} is invalid at ${part}`)
        }
        obj = obj[part]
      }

      // Set the value on the parent object
      const lastPart = parts[parts.length - 1]
      obj[lastPart] = val
    },
    { path: propertyPath, val: value }
  )
}
