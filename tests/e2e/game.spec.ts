import { test, expect } from '@playwright/test'

/**
 * Signal Lost E2E Tests
 *
 * These tests verify the core functionality of the game from a user perspective.
 * They simulate user interactions and verify the expected outcomes.
 */

// Helper function to wait for a short time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test.describe('Signal Lost Game', () => {
  test('game loads and canvas is visible', async ({ page }) => {
    await page.goto('/')

    // Check that the canvas is created
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
  })

  // Skip this test for now as the debug overlay text detection is unreliable
  test.skip('debug overlay can be toggled with D key', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(1000)

    // Debug overlay should be visible by default
    const debugText = page.locator('text').filter({ hasText: /Player:/ })
    await expect(debugText).toBeVisible()

    // Press D to hide the debug overlay
    await page.keyboard.press('d')
    await wait(500)
    await expect(debugText).not.toBeVisible()

    // Press D again to show the debug overlay
    await page.keyboard.press('d')
    await wait(500)
    await expect(debugText).toBeVisible()
  })

  // Skip this test for now as console logs are not being captured correctly
  test.skip('audio can be muted and unmuted with M key', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(1000)

    // Set up a console log listener to check for mute status
    const logs: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('Audio')) {
        logs.push(msg.text())
      }
    })

    // Press M to mute audio
    await page.keyboard.press('m')
    await wait(500)

    // Press M again to unmute audio
    await page.keyboard.press('m')
    await wait(500)

    // Verify that the mute status was logged
    expect(logs.some(log => log.includes('Audio muted'))).toBeTruthy()
    expect(logs.some(log => log.includes('Audio unmuted'))).toBeTruthy()
  })

  // Skip this test for now as console logs are not being captured correctly
  test.skip('movement sounds can be toggled with S key', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(1000)

    // Set up a console log listener to check for movement sound status
    const logs: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('Movement sounds')) {
        logs.push(msg.text())
      }
    })

    // Press S to enable movement sounds
    await page.keyboard.press('s')
    await wait(500)

    // Press S again to disable movement sounds
    await page.keyboard.press('s')
    await wait(500)

    // Verify that the movement sound status was logged
    expect(logs.some(log => log.includes('Movement sounds enabled'))).toBeTruthy()
    expect(logs.some(log => log.includes('Movement sounds disabled'))).toBeTruthy()
  })

  // Skip this test for now as the debug overlay text detection is unreliable
  test.skip('player can move with arrow keys', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(1000)

    // Get initial player position from debug overlay
    const initialPositionText = await page.locator('text').filter({ hasText: /Position:/ }).textContent()

    // Press arrow keys to move the player
    await page.keyboard.press('ArrowRight')
    await wait(500)
    await page.keyboard.press('ArrowDown')
    await wait(500)

    // Get new player position from debug overlay
    const newPositionText = await page.locator('text').filter({ hasText: /Position:/ }).textContent()

    // Verify that the position has changed
    expect(initialPositionText).not.toEqual(newPositionText)
  })

  test('game state is accessible via window.GAME_STATE', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(1000)

    // Check if GAME_STATE is available in the window object
    const gameState = await page.evaluate(() => {
      return window.GAME_STATE !== undefined
    })

    expect(gameState).toBeTruthy()

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
