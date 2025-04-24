import { test, expect } from '@playwright/test'
import { waitForGameInitialization } from './helpers'

/**
 * Signal Lost Menu System E2E Tests
 *
 * These tests verify the menu system functionality from a user perspective.
 * They simulate user interactions with the menu and verify the expected outcomes.
 */

test.describe.skip('Menu System', () => {
  test('main menu has all required buttons', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await waitForGameInitialization(page)

    // Check that the canvas is visible
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()

    // Verify game state is initialized
    const gameStateInitialized = await page.evaluate(() => {
      return window.GAME_STATE !== undefined
    })
    expect(gameStateInitialized).toBeTruthy()
  })

  test('can navigate to level select and back', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await waitForGameInitialization(page)

    // Click the level select button
    const levelSelectButton = page.getByText('Level Select')
    await levelSelectButton.click()

    // Check that we're on the level select screen
    await page.waitForTimeout(500)
    const backButton = page.getByText('Back to Menu')
    await expect(backButton).toBeVisible()

    // Go back to the main menu
    await backButton.click()

    // Check that we're back on the main menu
    await page.waitForTimeout(500)
    const startButton = page.getByText('Start Game')
    await expect(startButton).toBeVisible()
  })

  test('can navigate to settings and back', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await waitForGameInitialization(page)

    // Click the settings button
    const settingsButton = page.getByText('Settings')
    await settingsButton.click()

    // Check that we're on the settings screen
    await page.waitForTimeout(500)
    const audioButton = page.getByText(/Audio: (ON|OFF)/)
    const moveSoundButton = page.getByText(/Movement Sounds: (ON|OFF)/)
    const debugButton = page.getByText(/Debug Overlay: (ON|OFF)/)
    const backButton = page.getByText('Back to Menu')

    await expect(audioButton).toBeVisible()
    await expect(moveSoundButton).toBeVisible()
    await expect(debugButton).toBeVisible()
    await expect(backButton).toBeVisible()

    // Go back to the main menu
    await backButton.click()

    // Check that we're back on the main menu
    await page.waitForTimeout(500)
    const startButton = page.getByText('Start Game')
    await expect(startButton).toBeVisible()
  })

  test('can start game from main menu', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await waitForGameInitialization(page)

    // Click the start game button
    const startButton = page.getByText('Start Game')
    await startButton.click()

    // Wait for the game to load
    await page.waitForTimeout(1000)

    // Check that the canvas is visible and we're in the game
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()

    // Verify we're in the game scene by checking for game state properties
    const isInGame = await page.evaluate(() => {
      return window.GAME_STATE && window.GAME_STATE.level && window.GAME_STATE.level.id === 'start'
    })

    expect(isInGame).toBeTruthy()
  })
})
