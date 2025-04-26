import { test, expect } from '@playwright/test'
import { wait, waitForGameState, isCanvasVisible, navigateToScene, verifyScene } from './helpers'

/**
 * Signal Lost Menu System E2E Tests
 *
 * These tests verify the functionality of the menu system:
 * - Main menu navigation
 * - Level select functionality
 * - Settings menu functionality
 * - Keyboard navigation
 */
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

    // Check if canvas is visible (using optimized helper)
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()

    // Check if game state is initialized (using optimized helper)
    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()

    // Use our improved navigateToScene function
    const navigated = await navigateToScene(page, 'menu')
    expect(navigated).toBeTruthy()

    // Wait for the scene to initialize (reduced wait time)
    await wait(500)

    // Verify the game state reflects the menu scene (using helper)
    const inMenuScene = await verifyScene(page, 'menu')
    expect(inMenuScene).toBeTruthy()
  })

  test('can navigate from menu to game scene', async ({ page }) => {
    await page.goto('/')

    // Check if canvas is visible and game state is initialized (optimized)
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()

    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()

    // Navigate to the game scene directly (using helper)
    const navigated = await navigateToScene(page, 'game', { levelId: 'start' })
    expect(navigated).toBeTruthy()

    // Wait for the game scene to initialize (reduced wait time)
    await wait(500)

    // Verify we're in the game scene (using helper)
    const inGameScene = await verifyScene(page, 'game')
    expect(inGameScene).toBeTruthy()
  })

  test('can navigate from menu to level select scene', async ({ page }) => {
    await page.goto('/')

    // Check if canvas is visible and game state is initialized (optimized)
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()

    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()

    // Navigate to the level select scene directly (using helper)
    const navigated = await navigateToScene(page, 'levelSelect')
    expect(navigated).toBeTruthy()

    // Wait for the level select scene to initialize (reduced wait time)
    await wait(500)

    // Verify we're in the level select scene (using helper)
    const inLevelSelectScene = await verifyScene(page, 'levelSelect')
    expect(inLevelSelectScene).toBeTruthy()
  })

  test('can navigate from menu to settings scene', async ({ page }) => {
    await page.goto('/')

    // Check if canvas is visible and game state is initialized (optimized)
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()

    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()

    // Navigate to the settings scene directly (using helper)
    const navigated = await navigateToScene(page, 'settings')
    expect(navigated).toBeTruthy()

    // Wait for the settings scene to initialize (reduced wait time)
    await wait(500)

    // Verify we're in the settings scene (using helper)
    const inSettingsScene = await verifyScene(page, 'settings')
    expect(inSettingsScene).toBeTruthy()
  })

  test('game state has expected properties', async ({ page }) => {
    await page.goto('/')

    // Check if canvas is visible and game state is initialized (optimized)
    const canvasVisible = await isCanvasVisible(page)
    expect(canvasVisible).toBeTruthy()

    const gameStateInitialized = await waitForGameState(page)
    expect(gameStateInitialized).toBeTruthy()

    // Navigate to the game scene directly (using helper)
    const navigated = await navigateToScene(page, 'game', { levelId: 'start' })
    expect(navigated).toBeTruthy()

    // Wait for the game scene to initialize (reduced wait time)
    await wait(500)

    // Check if the game state has the expected properties (optimized check)
    const hasExpectedProperties = await page.evaluate(() => {
      // Check for required properties
      return window.GAME_STATE && window.GAME_STATE.player !== undefined && window.GAME_STATE.level !== undefined
    })

    expect(hasExpectedProperties).toBeTruthy()
  })
})
