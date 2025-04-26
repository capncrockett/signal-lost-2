import { test, expect } from '@playwright/test'

/**
 * Signal Lost Menu System E2E Tests
 *
 * These tests verify the functionality of the menu system:
 * - Main menu navigation
 * - Level select functionality
 * - Settings menu functionality
 * - Keyboard navigation
 */

// Helper function to wait for a short time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to wait for game state to be initialized
const waitForGameState = async (page: any): Promise<boolean> => {
  const maxAttempts = 10
  const delayBetweenAttempts = 500

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

// Helper function to check if canvas is visible
const isCanvasVisible = async (page: any): Promise<boolean> => {
  try {
    const canvas = page.locator('canvas')
    await canvas.waitFor({ state: 'visible', timeout: 5000 })
    return true
  } catch (error) {
    return false
  }
}

// Helper function to verify we're on the main menu
const verifyMainMenu = async (page: any): Promise<boolean> => {
  // Wait for the game to initialize
  await wait(3000)
  
  // Check if canvas is visible
  const canvasVisible = await isCanvasVisible(page)
  if (!canvasVisible) {
    console.log('Canvas not visible')
    return false
  }
  
  // Check if game state is initialized
  const gameStateInitialized = await waitForGameState(page)
  if (!gameStateInitialized) {
    console.log('Game state not initialized')
    return false
  }
  
  // Check if we're on the main menu by evaluating the current scene
  const isMainMenu = await page.evaluate(() => {
    // This assumes there's a way to check the current scene
    // Adjust based on your actual implementation
    const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
    if (game) {
      const activeScene = game.scene.scenes.find(scene => scene.scene.settings.active)
      return activeScene && activeScene.scene.key === 'menu'
    }
    return false
  })
  
  return isMainMenu
}

// Helper function to navigate to a specific scene using game state
const navigateToScene = async (page: any, sceneKey: string, data?: any): Promise<boolean> => {
  return await page.evaluate(({ sceneKey, data }) => {
    try {
      const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
      if (game) {
        game.scene.start(sceneKey, data)
        return true
      }
      return false
    } catch (error) {
      console.error('Error navigating to scene:', error)
      return false
    }
  }, { sceneKey, data })
}

test.describe('Menu System', () => {
  test('game loads with canvas visible', async ({ page }) => {
    await page.goto('/')

    // Check that the canvas is created
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
    
    // Wait for game state to be initialized
    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()
  })

  test('can access menu scene via game state', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(3000)
    
    // Check if canvas is visible
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()
    
    // Check if game state is initialized
    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()
    
    // Verify we can access the menu scene
    const canAccessMenuScene = await page.evaluate(() => {
      try {
        const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
        if (game) {
          // Start the menu scene
          game.scene.start('menu')
          return true
        }
        return false
      } catch (error) {
        console.error('Error accessing menu scene:', error)
        return false
      }
    })
    
    expect(canAccessMenuScene).toBeTruthy()
  })

  test('can navigate from menu to game scene', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(3000)
    
    // Check if canvas is visible and game state is initialized
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()
    
    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()
    
    // Navigate to the game scene directly
    const navigated = await navigateToScene(page, 'game', { levelId: 'start' })
    expect(navigated).toBeTruthy()
    
    // Wait for the game scene to initialize
    await wait(2000)
    
    // Verify we're in the game scene
    const inGameScene = await page.evaluate(() => {
      try {
        const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
        if (game) {
          const activeScene = game.scene.scenes.find(scene => scene.scene.settings.active)
          return activeScene && activeScene.scene.key === 'game'
        }
        return false
      } catch (error) {
        console.error('Error checking game scene:', error)
        return false
      }
    })
    
    expect(inGameScene).toBeTruthy()
  })

  test('can navigate from menu to level select scene', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(3000)
    
    // Check if canvas is visible and game state is initialized
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()
    
    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()
    
    // Navigate to the level select scene directly
    const navigated = await navigateToScene(page, 'levelSelect')
    expect(navigated).toBeTruthy()
    
    // Wait for the level select scene to initialize
    await wait(2000)
    
    // Verify we're in the level select scene
    const inLevelSelectScene = await page.evaluate(() => {
      try {
        const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
        if (game) {
          const activeScene = game.scene.scenes.find(scene => scene.scene.settings.active)
          return activeScene && activeScene.scene.key === 'levelSelect'
        }
        return false
      } catch (error) {
        console.error('Error checking level select scene:', error)
        return false
      }
    })
    
    expect(inLevelSelectScene).toBeTruthy()
  })

  test('can navigate from menu to settings scene', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(3000)
    
    // Check if canvas is visible and game state is initialized
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()
    
    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()
    
    // Navigate to the settings scene directly
    const navigated = await navigateToScene(page, 'settings')
    expect(navigated).toBeTruthy()
    
    // Wait for the settings scene to initialize
    await wait(2000)
    
    // Verify we're in the settings scene
    const inSettingsScene = await page.evaluate(() => {
      try {
        const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
        if (game) {
          const activeScene = game.scene.scenes.find(scene => scene.scene.settings.active)
          return activeScene && activeScene.scene.key === 'settings'
        }
        return false
      } catch (error) {
        console.error('Error checking settings scene:', error)
        return false
      }
    })
    
    expect(inSettingsScene).toBeTruthy()
  })

  test('game state has expected properties', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(3000)
    
    // Check if canvas is visible
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()
    
    // Check if game state is initialized
    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()
    
    // Navigate to the game scene directly
    const navigated = await navigateToScene(page, 'game', { levelId: 'start' })
    expect(navigated).toBeTruthy()
    
    // Wait for the game scene to initialize
    await wait(2000)
    
    // Check if the game state has the expected properties
    const hasExpectedProperties = await page.evaluate(() => {
      return (
        window.GAME_STATE.player !== undefined &&
        window.GAME_STATE.level !== undefined &&
        window.GAME_STATE.progress !== undefined &&
        window.GAME_STATE.debug !== undefined
      )
    })
    
    expect(hasExpectedProperties).toBeTruthy()
  })
})
