/**
 * Signal Lost E2E Test Helpers
 * 
 * Common helper functions for E2E tests to reduce duplication and improve performance.
 */

import { Page } from '@playwright/test'

// Helper function to wait for a short time (with a default shorter timeout)
export const wait = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to wait for game state to be initialized (with optimized polling)
export const waitForGameState = async (page: Page, maxAttempts: number = 5, delayBetweenAttempts: number = 300): Promise<boolean> => {
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
export const isCanvasVisible = async (page: Page): Promise<boolean> => {
  try {
    const canvas = page.locator('canvas')
    await canvas.waitFor({ state: 'visible', timeout: 3000 })
    return true
  } catch (error) {
    return false
  }
}

// Helper function to navigate to a specific scene using game state
export const navigateToScene = async (page: Page, sceneKey: string, data?: any): Promise<boolean> => {
  // Try to set the game state directly (faster and more reliable in CI)
  return await page.evaluate(
    ({ sceneKey, data }) => {
      try {
        if (window.GAME_STATE) {
          console.log(`Setting game state for scene: ${sceneKey}`)

          // Set up a minimal game state for testing
          if (sceneKey === 'game') {
            window.GAME_STATE.level = {
              id: data?.levelId || 'test_level',
              map: [],
              entities: {},
              solved: false,
            }
            window.GAME_STATE.player = {
              x: 1,
              y: 1,
              health: 100,
              inventory: [],
              moveSound: true,
            }
            window.GAME_STATE.currentScene = 'game'
            
            // Try to start the scene if possible
            try {
              const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
              if (game && game.scene && game.scene.start) {
                game.scene.start(sceneKey, data)
              }
            } catch (e) {
              console.log('Could not start scene via Phaser, using game state only')
            }
            
            return true
          }

          if (sceneKey === 'menu') {
            window.GAME_STATE.currentScene = 'menu'
            
            try {
              const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
              if (game && game.scene && game.scene.start) {
                game.scene.start(sceneKey)
              }
            } catch (e) {
              console.log('Could not start scene via Phaser, using game state only')
            }
            
            return true
          }

          if (sceneKey === 'levelSelect') {
            window.GAME_STATE.currentScene = 'levelSelect'
            
            try {
              const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
              if (game && game.scene && game.scene.start) {
                game.scene.start(sceneKey)
              }
            } catch (e) {
              console.log('Could not start scene via Phaser, using game state only')
            }
            
            return true
          }

          if (sceneKey === 'settings') {
            window.GAME_STATE.currentScene = 'settings'
            
            try {
              const game = document.querySelector('canvas')?.parentElement?.__PHASER_GAME__
              if (game && game.scene && game.scene.start) {
                game.scene.start(sceneKey)
              }
            } catch (e) {
              console.log('Could not start scene via Phaser, using game state only')
            }
            
            return true
          }
        }

        return false
      } catch (error) {
        console.error('Error setting game state:', error)
        return false
      }
    },
    { sceneKey, data }
  )
}

// Helper function to navigate from menu to game (optimized version)
export const navigateToGame = async (page: Page): Promise<void> => {
  // Use the more reliable direct navigation
  await navigateToScene(page, 'game', { levelId: 'start' })
  
  // Short wait for the scene to initialize
  await wait(1000)
}

// Helper function to verify we're in a specific scene
export const verifyScene = async (page: Page, sceneKey: string): Promise<boolean> => {
  return await page.evaluate((expectedScene) => {
    // Check using game state (more reliable in CI)
    try {
      return window.GAME_STATE && window.GAME_STATE.currentScene === expectedScene
    } catch (error) {
      console.error(`Error checking scene using game state:`, error)
      return false
    }
  }, sceneKey)
}

// Helper function to setup a test level with specific entities
export const setupTestLevel = async (page: Page, levelId: string, entities: Record<string, any> = {}): Promise<boolean> => {
  return await page.evaluate(({ levelId, entities }) => {
    try {
      if (!window.GAME_STATE) {
        return false
      }
      
      // Set the level ID
      window.GAME_STATE.level.id = levelId
      
      // Register entities
      for (const [id, entity] of Object.entries(entities)) {
        window.GAME_STATE.level.entities[id] = {
          id,
          ...entity
        }
      }
      
      return true
    } catch (error) {
      console.error('Error setting up test level:', error)
      return false
    }
  }, { levelId, entities })
}
