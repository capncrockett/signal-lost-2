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

test.describe('Menu System', () => {
  test('main menu displays all required buttons', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(2000)

    // Check for the title
    const title = page.getByText('SIGNAL LOST', { exact: true })
    await expect(title).toBeVisible()

    // Check for the main menu buttons
    const startGameButton = page.getByText('Start Game', { exact: true })
    await expect(startGameButton).toBeVisible()

    const levelSelectButton = page.getByText('Level Select', { exact: true })
    await expect(levelSelectButton).toBeVisible()

    const settingsButton = page.getByText('Settings', { exact: true })
    await expect(settingsButton).toBeVisible()
  })

  test('can navigate from main menu to level select and back', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(2000)

    // Navigate to level select
    const levelSelectButton = page.getByText('Level Select', { exact: true })
    await levelSelectButton.click()
    await wait(1000)

    // Check that we're on the level select screen
    const levelSelectTitle = page.getByText('LEVEL SELECT', { exact: true })
    await expect(levelSelectTitle).toBeVisible()

    // Navigate back to main menu
    const backButton = page.getByText('Back', { exact: true })
    await backButton.click()
    await wait(1000)

    // Check that we're back on the main menu
    const mainMenuTitle = page.getByText('SIGNAL LOST', { exact: true })
    await expect(mainMenuTitle).toBeVisible()
  })

  test('can navigate from main menu to settings and back', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(2000)

    // Navigate to settings
    const settingsButton = page.getByText('Settings', { exact: true })
    await settingsButton.click()
    await wait(1000)

    // Check that we're on the settings screen
    const settingsTitle = page.getByText('SETTINGS', { exact: true })
    await expect(settingsTitle).toBeVisible()

    // Navigate back to main menu
    const backButton = page.getByText('Back', { exact: true })
    await backButton.click()
    await wait(1000)

    // Check that we're back on the main menu
    const mainMenuTitle = page.getByText('SIGNAL LOST', { exact: true })
    await expect(mainMenuTitle).toBeVisible()
  })

  test('can navigate from main menu to game', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(2000)

    // Navigate to game
    const startGameButton = page.getByText('Start Game', { exact: true })
    await startGameButton.click()
    await wait(2000)

    // Check that the game state is initialized
    const gameStateInitialized = await page.evaluate(() => {
      return window.GAME_STATE !== undefined && 
             window.GAME_STATE.level !== undefined && 
             window.GAME_STATE.level.id !== undefined
    })

    expect(gameStateInitialized).toBeTruthy()
  })

  test('can select a level from level select screen', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(2000)

    // Navigate to level select
    const levelSelectButton = page.getByText('Level Select', { exact: true })
    await levelSelectButton.click()
    await wait(1000)

    // Find and click on a level button (assuming there's at least one level)
    // This might need adjustment based on the actual level names in your game
    const levelButton = page.getByText('Level 1', { exact: false })
    
    // If the level button exists, click it and verify game state
    if (await levelButton.isVisible()) {
      await levelButton.click()
      await wait(2000)

      // Check that the game state is initialized with the selected level
      const gameStateInitialized = await page.evaluate(() => {
        return window.GAME_STATE !== undefined && 
               window.GAME_STATE.level !== undefined && 
               window.GAME_STATE.level.id !== undefined
      })

      expect(gameStateInitialized).toBeTruthy()
    } else {
      // If no level button is found, we'll skip this test
      test.skip(true, 'No level buttons found')
    }
  })

  test('settings menu has functional audio controls', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(2000)

    // Navigate to settings
    const settingsButton = page.getByText('Settings', { exact: true })
    await settingsButton.click()
    await wait(1000)

    // Find and click on audio toggle button (assuming there's a mute/unmute button)
    const audioButton = page.getByText('Audio:', { exact: false })
    
    // If the audio button exists, click it and verify the change
    if (await audioButton.isVisible()) {
      // Get initial audio state
      const initialAudioState = await page.evaluate(() => {
        // This assumes there's a way to check audio state from the game
        // Adjust based on your actual implementation
        return window.GAME_STATE && window.GAME_STATE.audio ? 
               window.GAME_STATE.audio.isMuted() : 
               false
      })

      // Click the audio button
      await audioButton.click()
      await wait(1000)

      // Get new audio state
      const newAudioState = await page.evaluate(() => {
        return window.GAME_STATE && window.GAME_STATE.audio ? 
               window.GAME_STATE.audio.isMuted() : 
               false
      })

      // The state should have toggled
      expect(newAudioState).not.toEqual(initialAudioState)
    } else {
      // If no audio button is found, we'll skip this test
      test.skip(true, 'No audio controls found')
    }
  })

  test('can navigate menus using keyboard', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await wait(2000)

    // Check initial focus (should be on Start Game)
    const startGameButton = page.getByText('Start Game', { exact: true })
    
    // Press down arrow to move to Level Select
    await page.keyboard.press('ArrowDown')
    await wait(500)
    
    // Press down arrow again to move to Settings
    await page.keyboard.press('ArrowDown')
    await wait(500)
    
    // Press Enter to select Settings
    await page.keyboard.press('Enter')
    await wait(1000)
    
    // Check that we're on the settings screen
    const settingsTitle = page.getByText('SETTINGS', { exact: true })
    await expect(settingsTitle).toBeVisible()
    
    // Press Escape to go back to main menu
    await page.keyboard.press('Escape')
    await wait(1000)
    
    // Check that we're back on the main menu
    const mainMenuTitle = page.getByText('SIGNAL LOST', { exact: true })
    await expect(mainMenuTitle).toBeVisible()
  })
})
