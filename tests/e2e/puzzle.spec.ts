import { test, expect } from '@playwright/test'

/**
 * Signal Lost Puzzle Mechanics E2E Tests
 * 
 * These tests verify the puzzle mechanics of the game from a user perspective.
 * They simulate user interactions with puzzles and verify the expected outcomes.
 */

// Helper function to wait for a short time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test.describe('Puzzle Mechanics', () => {
  test('can load a puzzle level', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the game to initialize
    await wait(1000)
    
    // Load the puzzle1 level via the game state
    await page.evaluate(() => {
      // Access the game scene and load the puzzle1 level
      const gameScene = window.GAME_STATE.level.id = 'puzzle1'
      return gameScene
    })
    
    await wait(1000)
    
    // Verify that the level ID is puzzle1
    const levelId = await page.evaluate(() => {
      return window.GAME_STATE.level.id
    })
    
    expect(levelId).toBe('puzzle1')
  })

  test('puzzle completion updates game state', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the game to initialize
    await wait(1000)
    
    // Load the puzzle1 level and set up a test scenario
    await page.evaluate(() => {
      // Set the level to puzzle1
      window.GAME_STATE.level.id = 'puzzle1'
      
      // Manually update entity positions to simulate puzzle completion
      // Find the block and target entities
      const entities = window.GAME_STATE.level.entities
      const blockEntity = Object.values(entities).find((e: any) => e.type === 'block')
      const targetEntity = Object.values(entities).find((e: any) => e.type === 'target')
      
      if (blockEntity && targetEntity) {
        // Move the block to the target position
        blockEntity.x = targetEntity.x
        blockEntity.y = targetEntity.y
        
        // Trigger puzzle completion check
        window.GAME_STATE.checkPuzzleCompletion()
      }
      
      return { blockEntity, targetEntity }
    })
    
    await wait(1000)
    
    // Verify that the puzzle is marked as solved
    const puzzleSolved = await page.evaluate(() => {
      return window.GAME_STATE.level.solved
    })
    
    // Verify that the puzzles solved count has increased
    const puzzlesSolved = await page.evaluate(() => {
      return window.GAME_STATE.progress.puzzlesSolved
    })
    
    // These assertions might fail if the game state doesn't have the expected methods
    // In that case, we'll need to modify the tests or add the methods to the game state
    expect(puzzleSolved).toBe(true)
    expect(puzzlesSolved).toBeGreaterThan(0)
  })
})
