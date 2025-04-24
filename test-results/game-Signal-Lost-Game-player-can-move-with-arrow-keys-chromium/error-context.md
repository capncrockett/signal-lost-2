# Test info

- Name: Signal Lost Game >> player can move with arrow keys
- Location: C:\Users\capnc\Codin\signal-lost-2\tests\e2e\game.spec.ts:97:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\capnc\AppData\Local\ms-playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | /**
   4 |  * Signal Lost E2E Tests
   5 |  *
   6 |  * These tests verify the core functionality of the game from a user perspective.
   7 |  * They simulate user interactions and verify the expected outcomes.
   8 |  */
   9 |
   10 | // Helper function to wait for a short time
   11 | const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
   12 |
   13 | test.describe('Signal Lost Game', () => {
   14 |   test('game loads and canvas is visible', async ({ page }) => {
   15 |     await page.goto('/')
   16 |
   17 |     // Check that the canvas is created
   18 |     const canvas = page.locator('canvas')
   19 |     await expect(canvas).toBeVisible()
   20 |   })
   21 |
   22 |   test('debug overlay can be toggled with D key', async ({ page }) => {
   23 |     await page.goto('/')
   24 |
   25 |     // Wait for the game to initialize
   26 |     await wait(1000)
   27 |
   28 |     // Debug overlay should be visible by default
   29 |     const debugText = page.locator('text').filter({ hasText: /Player:/ })
   30 |     await expect(debugText).toBeVisible()
   31 |
   32 |     // Press D to hide the debug overlay
   33 |     await page.keyboard.press('d')
   34 |     await wait(500)
   35 |     await expect(debugText).not.toBeVisible()
   36 |
   37 |     // Press D again to show the debug overlay
   38 |     await page.keyboard.press('d')
   39 |     await wait(500)
   40 |     await expect(debugText).toBeVisible()
   41 |   })
   42 |
   43 |   test('audio can be muted and unmuted with M key', async ({ page }) => {
   44 |     await page.goto('/')
   45 |
   46 |     // Wait for the game to initialize
   47 |     await wait(1000)
   48 |
   49 |     // Set up a console log listener to check for mute status
   50 |     const logs: string[] = []
   51 |     page.on('console', msg => {
   52 |       if (msg.text().includes('Audio')) {
   53 |         logs.push(msg.text())
   54 |       }
   55 |     })
   56 |
   57 |     // Press M to mute audio
   58 |     await page.keyboard.press('m')
   59 |     await wait(500)
   60 |
   61 |     // Press M again to unmute audio
   62 |     await page.keyboard.press('m')
   63 |     await wait(500)
   64 |
   65 |     // Verify that the mute status was logged
   66 |     expect(logs.some(log => log.includes('Audio muted'))).toBeTruthy()
   67 |     expect(logs.some(log => log.includes('Audio unmuted'))).toBeTruthy()
   68 |   })
   69 |
   70 |   test('movement sounds can be toggled with S key', async ({ page }) => {
   71 |     await page.goto('/')
   72 |
   73 |     // Wait for the game to initialize
   74 |     await wait(1000)
   75 |
   76 |     // Set up a console log listener to check for movement sound status
   77 |     const logs: string[] = []
   78 |     page.on('console', msg => {
   79 |       if (msg.text().includes('Movement sounds')) {
   80 |         logs.push(msg.text())
   81 |       }
   82 |     })
   83 |
   84 |     // Press S to enable movement sounds
   85 |     await page.keyboard.press('s')
   86 |     await wait(500)
   87 |
   88 |     // Press S again to disable movement sounds
   89 |     await page.keyboard.press('s')
   90 |     await wait(500)
   91 |
   92 |     // Verify that the movement sound status was logged
   93 |     expect(logs.some(log => log.includes('Movement sounds enabled'))).toBeTruthy()
   94 |     expect(logs.some(log => log.includes('Movement sounds disabled'))).toBeTruthy()
   95 |   })
   96 |
>  97 |   test('player can move with arrow keys', async ({ page }) => {
      |   ^ Error: browserType.launch: Executable doesn't exist at C:\Users\capnc\AppData\Local\ms-playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
   98 |     await page.goto('/')
   99 |
  100 |     // Wait for the game to initialize
  101 |     await wait(1000)
  102 |
  103 |     // Get initial player position from debug overlay
  104 |     const initialPositionText = await page.locator('text').filter({ hasText: /Position:/ }).textContent()
  105 |
  106 |     // Press arrow keys to move the player
  107 |     await page.keyboard.press('ArrowRight')
  108 |     await wait(500)
  109 |     await page.keyboard.press('ArrowDown')
  110 |     await wait(500)
  111 |
  112 |     // Get new player position from debug overlay
  113 |     const newPositionText = await page.locator('text').filter({ hasText: /Position:/ }).textContent()
  114 |
  115 |     // Verify that the position has changed
  116 |     expect(initialPositionText).not.toEqual(newPositionText)
  117 |   })
  118 |
  119 |   test('game state is accessible via window.GAME_STATE', async ({ page }) => {
  120 |     await page.goto('/')
  121 |
  122 |     // Wait for the game to initialize
  123 |     await wait(1000)
  124 |
  125 |     // Check if GAME_STATE is available in the window object
  126 |     const gameState = await page.evaluate(() => {
  127 |       return window.GAME_STATE !== undefined
  128 |     })
  129 |
  130 |     expect(gameState).toBeTruthy()
  131 |
  132 |     // Check if the game state has the expected properties
  133 |     const hasExpectedProperties = await page.evaluate(() => {
  134 |       return (
  135 |         window.GAME_STATE.player !== undefined &&
  136 |         window.GAME_STATE.level !== undefined &&
  137 |         window.GAME_STATE.progress !== undefined &&
  138 |         window.GAME_STATE.debug !== undefined
  139 |       )
  140 |     })
  141 |
  142 |     expect(hasExpectedProperties).toBeTruthy()
  143 |   })
  144 | })
  145 |
```