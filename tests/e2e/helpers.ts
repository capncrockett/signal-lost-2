import { Page } from '@playwright/test'

/**
 * Helper function to wait for a short time
 */
export const wait = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Helper function to wait for game state to be initialized
 */
export const waitForGameState = async (page: Page, maxAttempts: number = 10, delayBetweenAttempts: number = 500): Promise<boolean> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const gameStateExists = await page.evaluate(() => {
      return window.GAME_STATE !== undefined
    })

    if (gameStateExists) {
      return true
    }

    await wait(delayBetweenAttempts)
  }

  return false
}

/**
 * Helper function to navigate from menu to game
 */
export const navigateToGame = async (page: Page): Promise<void> => {
  // Wait for the menu to be visible
  await wait(2000)

  try {
    // Try to find and click the Start Game button
    const startButton = page.getByText('Start Game', { exact: true })
    await startButton.waitFor({ timeout: 5000 })
    await startButton.click()
  } catch (error) {
    console.log('Start Game button not found, checking if already in game scene')

    // Check if we're already in the game scene
    const isInGameScene = await page
      .evaluate(() => {
        return window.GAME_STATE && window.GAME_STATE.level && window.GAME_STATE.level.id !== undefined
      })
      .catch(() => false)

    if (!isInGameScene) {
      // If we're not in the game scene, try to find the button with a different selector
      try {
        await page.locator('text=Start Game').click({ timeout: 5000 })
      } catch (innerError) {
        console.log('Could not find Start Game button with alternate selector')
        // Just continue and hope we're in the right scene
      }
    }
  }

  // Wait for the game to initialize
  await wait(2000)

  // Wait for game state to be initialized
  await waitForGameState(page)
}

/**
 * Helper function to set up a test level with specific entities
 */
export const setupTestLevel = async (page: Page, entities: Record<string, any>): Promise<void> => {
  await page.evaluate((entitiesJson) => {
    // Initialize a test level
    window.GAME_STATE.loadLevel('test')
    
    // Register all provided entities
    const entities = JSON.parse(entitiesJson)
    Object.keys(entities).forEach(entityId => {
      window.GAME_STATE.registerEntity(entityId, entities[entityId])
    })
  }, JSON.stringify(entities))
  
  await wait(500)
}
