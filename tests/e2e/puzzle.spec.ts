import { test, expect } from '@playwright/test'
import { waitForGameInitialization, navigateToLevel, getGameStateProperty, setGameStateProperty } from './helpers'

/**
 * Signal Lost Puzzle Mechanics E2E Tests
 *
 * These tests verify the puzzle mechanics of the game from a user perspective.
 * They simulate user interactions with puzzles and verify the expected outcomes.
 */

test.describe('Puzzle Mechanics', () => {
  test('can load a puzzle level', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await waitForGameInitialization(page)

    // Set the level directly via game state
    await page.evaluate(() => {
      window.GAME_STATE.loadLevel('puzzle1')
    })
    await page.waitForTimeout(500)

    // Verify that the level ID is puzzle1
    const levelId = await getGameStateProperty<string>(page, 'level.id')
    expect(levelId).toBe('puzzle1')
  })

  test('puzzle completion updates game state', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await waitForGameInitialization(page)

    // Set the level directly via game state
    await page.evaluate(() => {
      window.GAME_STATE.loadLevel('puzzle1')
    })
    await page.waitForTimeout(500)

    // Get initial puzzle solved state and count
    const initialSolved = await getGameStateProperty<boolean>(page, 'level.solved')
    const initialPuzzlesSolved = await getGameStateProperty<number>(page, 'progress.puzzlesSolved')

    expect(initialSolved).toBe(false)

    // Simulate puzzle completion by directly calling the solveLevel method
    await page.evaluate(() => {
      window.GAME_STATE.solveLevel()
    })

    await page.waitForTimeout(500)

    // Verify that the puzzle is marked as solved
    const puzzleSolved = await getGameStateProperty<boolean>(page, 'level.solved')
    expect(puzzleSolved).toBe(true)

    // Verify that the puzzles solved count has increased
    const puzzlesSolved = await getGameStateProperty<number>(page, 'progress.puzzlesSolved')
    expect(puzzlesSolved).toBeGreaterThan(initialPuzzlesSolved)
  })
})
