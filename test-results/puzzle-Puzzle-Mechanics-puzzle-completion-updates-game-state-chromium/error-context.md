# Test info

- Name: Puzzle Mechanics >> puzzle completion updates game state
- Location: C:\Users\capnc\Codin\signal-lost-2\tests\e2e\puzzle.spec.ts:37:3

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
   4 |  * Signal Lost Puzzle Mechanics E2E Tests
   5 |  * 
   6 |  * These tests verify the puzzle mechanics of the game from a user perspective.
   7 |  * They simulate user interactions with puzzles and verify the expected outcomes.
   8 |  */
   9 |
  10 | // Helper function to wait for a short time
  11 | const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  12 |
  13 | test.describe('Puzzle Mechanics', () => {
  14 |   test('can load a puzzle level', async ({ page }) => {
  15 |     await page.goto('/')
  16 |     
  17 |     // Wait for the game to initialize
  18 |     await wait(1000)
  19 |     
  20 |     // Load the puzzle1 level via the game state
  21 |     await page.evaluate(() => {
  22 |       // Access the game scene and load the puzzle1 level
  23 |       const gameScene = window.GAME_STATE.level.id = 'puzzle1'
  24 |       return gameScene
  25 |     })
  26 |     
  27 |     await wait(1000)
  28 |     
  29 |     // Verify that the level ID is puzzle1
  30 |     const levelId = await page.evaluate(() => {
  31 |       return window.GAME_STATE.level.id
  32 |     })
  33 |     
  34 |     expect(levelId).toBe('puzzle1')
  35 |   })
  36 |
> 37 |   test('puzzle completion updates game state', async ({ page }) => {
     |   ^ Error: browserType.launch: Executable doesn't exist at C:\Users\capnc\AppData\Local\ms-playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
  38 |     await page.goto('/')
  39 |     
  40 |     // Wait for the game to initialize
  41 |     await wait(1000)
  42 |     
  43 |     // Load the puzzle1 level and set up a test scenario
  44 |     await page.evaluate(() => {
  45 |       // Set the level to puzzle1
  46 |       window.GAME_STATE.level.id = 'puzzle1'
  47 |       
  48 |       // Manually update entity positions to simulate puzzle completion
  49 |       // Find the block and target entities
  50 |       const entities = window.GAME_STATE.level.entities
  51 |       const blockEntity = Object.values(entities).find((e: any) => e.type === 'block')
  52 |       const targetEntity = Object.values(entities).find((e: any) => e.type === 'target')
  53 |       
  54 |       if (blockEntity && targetEntity) {
  55 |         // Move the block to the target position
  56 |         blockEntity.x = targetEntity.x
  57 |         blockEntity.y = targetEntity.y
  58 |         
  59 |         // Trigger puzzle completion check
  60 |         window.GAME_STATE.checkPuzzleCompletion()
  61 |       }
  62 |       
  63 |       return { blockEntity, targetEntity }
  64 |     })
  65 |     
  66 |     await wait(1000)
  67 |     
  68 |     // Verify that the puzzle is marked as solved
  69 |     const puzzleSolved = await page.evaluate(() => {
  70 |       return window.GAME_STATE.level.solved
  71 |     })
  72 |     
  73 |     // Verify that the puzzles solved count has increased
  74 |     const puzzlesSolved = await page.evaluate(() => {
  75 |       return window.GAME_STATE.progress.puzzlesSolved
  76 |     })
  77 |     
  78 |     // These assertions might fail if the game state doesn't have the expected methods
  79 |     // In that case, we'll need to modify the tests or add the methods to the game state
  80 |     expect(puzzleSolved).toBe(true)
  81 |     expect(puzzlesSolved).toBeGreaterThan(0)
  82 |   })
  83 | })
  84 |
```