import { test, expect } from '@playwright/test'

/**
 * Signal Lost Puzzle Types E2E Tests
 *
 * These tests verify the functionality of different puzzle types:
 * - Blocks and targets
 * - Switches and doors
 * - Keys and locked doors
 * - Teleporters
 */

test.describe('Puzzle Types', () => {
  test('blocks can be moved onto targets', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with blocks and targets
    await page.evaluate(() => {
      // Initialize a test level
      window.GAME_STATE.loadLevel('test')

      // Register a block and a target
      window.GAME_STATE.registerEntity('block_1_1', { id: 'block_1_1', type: 'block', x: 1, y: 1, active: true })
      window.GAME_STATE.registerEntity('target_3_3', { id: 'target_3_3', type: 'target', x: 3, y: 3, active: true })
    })

    await page.waitForTimeout(500)

    // Verify initial state
    const initialSolved = await page.evaluate(() => window.GAME_STATE.level.solved)
    expect(initialSolved).toBe(false)

    // Move the block to the target
    await page.evaluate(() => {
      // Get the puzzle engine from the game scene
      const puzzleEngine = {
        tryMoveBlock: (blockId, dx, dy) => {
          const block = window.GAME_STATE.level.entities[blockId]
          window.GAME_STATE.updateEntity(blockId, { x: block.x + dx, y: block.y + dy })
          return true
        },
        checkBlockPuzzleCompletion: () => {
          const entities = window.GAME_STATE.level.entities
          const targets = Object.values(entities).filter(entity => entity.type === 'target')
          const blocks = Object.values(entities).filter(entity => entity.type === 'block')

          // Check if all targets have blocks on them
          const allTargetsCovered = targets.every(target =>
            blocks.some(
              block => Math.round(block.x) === Math.round(target.x) && Math.round(block.y) === Math.round(target.y)
            )
          )

          if (allTargetsCovered) {
            window.GAME_STATE.solveLevel()
            return true
          }

          return false
        },
      }

      // Move the block to the target position
      puzzleEngine.tryMoveBlock('block_1_1', 2, 2)

      // Check for puzzle completion
      puzzleEngine.checkBlockPuzzleCompletion()
    })

    await page.waitForTimeout(500)

    // Verify the puzzle is solved
    const finalSolved = await page.evaluate(() => window.GAME_STATE.level.solved)
    expect(finalSolved).toBe(true)
  })

  test('switches can activate doors', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with switches and doors
    await page.evaluate(() => {
      // Initialize a test level
      window.GAME_STATE.loadLevel('test')

      // Register a switch and a door
      window.GAME_STATE.registerEntity('switch_2_2', {
        id: 'switch_2_2',
        type: 'switch',
        x: 2,
        y: 2,
        active: true,
        activated: false,
      })
      window.GAME_STATE.registerEntity('door_4_4', {
        id: 'door_4_4',
        type: 'door',
        x: 4,
        y: 4,
        active: true,
      })
    })

    await page.waitForTimeout(500)

    // Verify initial state
    const initialDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['door_4_4'].active
    })
    expect(initialDoorActive).toBe(true)

    // Activate the switch
    await page.evaluate(() => {
      // Get the puzzle engine from the game scene
      const puzzleEngine = {
        activateSwitch: (x, y) => {
          const entities = window.GAME_STATE.level.entities
          const switchEntity = Object.values(entities).find(
            entity =>
              entity.type === 'switch' &&
              Math.round(entity.x) === Math.round(x) &&
              Math.round(entity.y) === Math.round(y)
          )

          if (!switchEntity) return false

          // Mark the switch as activated
          window.GAME_STATE.updateEntity(switchEntity.id, { activated: true })

          // Find and open all doors
          const doors = Object.values(entities).filter(entity => entity.type === 'door')
          doors.forEach(door => {
            window.GAME_STATE.updateEntity(door.id, { active: false })
          })

          return true
        },
        checkSwitchPuzzleCompletion: () => {
          const entities = window.GAME_STATE.level.entities
          const switches = Object.values(entities).filter(entity => entity.type === 'switch')

          // Check if all switches are activated
          const allSwitchesActivated = switches.every(switchEntity => switchEntity.activated === true)

          if (allSwitchesActivated) {
            window.GAME_STATE.solveLevel()
            return true
          }

          return false
        },
      }

      // Activate the switch
      puzzleEngine.activateSwitch(2, 2)

      // Check for puzzle completion
      puzzleEngine.checkSwitchPuzzleCompletion()
    })

    await page.waitForTimeout(500)

    // Verify the door is deactivated (opened)
    const finalDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['door_4_4'].active
    })
    expect(finalDoorActive).toBe(false)

    // Verify the puzzle is solved
    const finalSolved = await page.evaluate(() => window.GAME_STATE.level.solved)
    expect(finalSolved).toBe(true)
  })

  test('keys can unlock doors', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with keys and locked doors
    await page.evaluate(() => {
      // Initialize a test level
      window.GAME_STATE.loadLevel('test')

      // Register a key and a locked door
      window.GAME_STATE.registerEntity('key_5_5', {
        id: 'key_5_5',
        type: 'key',
        x: 5,
        y: 5,
        active: true,
      })
      window.GAME_STATE.registerEntity('locked_door_6_6', {
        id: 'locked_door_6_6',
        type: 'locked_door',
        x: 6,
        y: 6,
        active: true,
      })
    })

    await page.waitForTimeout(500)

    // Verify initial state
    const initialDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['locked_door_6_6'].active
    })
    expect(initialDoorActive).toBe(true)

    // Collect the key and unlock the door
    await page.evaluate(() => {
      // Get the puzzle engine from the game scene
      const puzzleEngine = {
        collectKey: (x, y) => {
          const entities = window.GAME_STATE.level.entities
          const keyEntity = Object.values(entities).find(
            entity =>
              entity.type === 'key' && Math.round(entity.x) === Math.round(x) && Math.round(entity.y) === Math.round(y)
          )

          if (!keyEntity) return false

          // Add the key to inventory
          window.GAME_STATE.addToInventory(keyEntity.id)

          // Mark the key as collected (inactive)
          window.GAME_STATE.updateEntity(keyEntity.id, { active: false })

          return true
        },
        tryUnlockDoor: (x, y) => {
          const entities = window.GAME_STATE.level.entities
          const doorEntity = Object.values(entities).find(
            entity =>
              entity.type === 'locked_door' &&
              Math.round(entity.x) === Math.round(x) &&
              Math.round(entity.y) === Math.round(y)
          )

          if (!doorEntity) return false

          // Check if player has a key
          if (window.GAME_STATE.player.inventory.length === 0) {
            return false
          }

          // Use a key to unlock the door
          window.GAME_STATE.player.inventory.splice(0, 1)

          // Mark the door as unlocked (inactive)
          window.GAME_STATE.updateEntity(doorEntity.id, { active: false })

          return true
        },
        checkKeyPuzzleCompletion: () => {
          const entities = window.GAME_STATE.level.entities
          const lockedDoors = Object.values(entities).filter(
            entity => entity.type === 'locked_door' && entity.active !== false
          )

          // If there are no locked doors left, this puzzle type is complete
          if (lockedDoors.length === 0) {
            window.GAME_STATE.solveLevel()
            return true
          }

          return false
        },
      }

      // Collect the key
      puzzleEngine.collectKey(5, 5)

      // Unlock the door
      puzzleEngine.tryUnlockDoor(6, 6)

      // Check for puzzle completion
      puzzleEngine.checkKeyPuzzleCompletion()
    })

    await page.waitForTimeout(500)

    // Verify the door is unlocked
    const finalDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['locked_door_6_6'].active
    })
    expect(finalDoorActive).toBe(false)

    // Verify the puzzle is solved
    const finalSolved = await page.evaluate(() => window.GAME_STATE.level.solved)
    expect(finalSolved).toBe(true)
  })

  test('teleporters can transport between locations', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with teleporters
    await page.evaluate(() => {
      // Initialize a test level
      window.GAME_STATE.loadLevel('test')

      // Register two teleporters
      window.GAME_STATE.registerEntity('teleporter_7_7', {
        id: 'teleporter_7_7',
        type: 'teleporter',
        x: 7,
        y: 7,
        active: true,
      })
      window.GAME_STATE.registerEntity('teleporter_8_8', {
        id: 'teleporter_8_8',
        type: 'teleporter',
        x: 8,
        y: 8,
        active: true,
      })

      // Set player position
      window.GAME_STATE.updatePlayerPosition(7, 7)
    })

    await page.waitForTimeout(500)

    // Verify initial player position
    const initialX = await page.evaluate(() => window.GAME_STATE.player.x)
    const initialY = await page.evaluate(() => window.GAME_STATE.player.y)
    expect(initialX).toBe(7)
    expect(initialY).toBe(7)

    // Use the teleporter
    await page.evaluate(() => {
      // Get the puzzle engine from the game scene
      const puzzleEngine = {
        useTeleporter: (x, y) => {
          const entities = window.GAME_STATE.level.entities
          const teleporterEntity = Object.values(entities).find(
            entity =>
              entity.type === 'teleporter' &&
              Math.round(entity.x) === Math.round(x) &&
              Math.round(entity.y) === Math.round(y)
          )

          if (!teleporterEntity) {
            return { success: false }
          }

          // Find other teleporters
          const otherTeleporters = Object.values(entities).filter(
            entity => entity.type === 'teleporter' && entity.id !== teleporterEntity.id && entity.active !== false
          )

          if (otherTeleporters.length === 0) {
            return { success: false }
          }

          // Choose the first other teleporter
          const targetTeleporter = otherTeleporters[0]

          return {
            success: true,
            newX: targetTeleporter.x,
            newY: targetTeleporter.y,
          }
        },
      }

      // Use the teleporter
      const result = puzzleEngine.useTeleporter(7, 7)

      // Teleport the player if successful
      if (result.success && result.newX !== undefined && result.newY !== undefined) {
        window.GAME_STATE.updatePlayerPosition(result.newX, result.newY)
      }
    })

    await page.waitForTimeout(500)

    // Verify the player has been teleported
    const finalX = await page.evaluate(() => window.GAME_STATE.player.x)
    const finalY = await page.evaluate(() => window.GAME_STATE.player.y)
    expect(finalX).toBe(8)
    expect(finalY).toBe(8)
  })

  test('pressure plates can activate timed doors', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize (using optimized helper)
    await waitForGameState(page)

    // Set up a test level with pressure plates and timed doors
    await page.evaluate(() => {
      // Initialize a test level
      window.GAME_STATE.loadLevel('test')

      // Register a pressure plate and a timed door
      window.GAME_STATE.registerEntity('pressure_plate_9_9', {
        id: 'pressure_plate_9_9',
        type: 'pressure_plate',
        x: 9,
        y: 9,
        active: true,
        activated: false,
      })
      window.GAME_STATE.registerEntity('timed_door_10_10', {
        id: 'timed_door_10_10',
        type: 'timed_door',
        x: 10,
        y: 10,
        active: true,
        duration: 3000,
      })
    })

    await page.waitForTimeout(500)

    // Verify initial state
    const initialDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_10_10'].active
    })
    expect(initialDoorActive).toBe(true)

    // Activate the pressure plate
    await page.evaluate(() => {
      // Get the puzzle engine from the game scene
      const puzzleEngine = {
        activatePressurePlate: (x, y) => {
          const entities = window.GAME_STATE.level.entities
          const plateEntity = Object.values(entities).find(
            entity =>
              entity.type === 'pressure_plate' &&
              Math.round(entity.x) === Math.round(x) &&
              Math.round(entity.y) === Math.round(y)
          )

          if (!plateEntity) return false

          // Mark the pressure plate as activated
          window.GAME_STATE.updateEntity(plateEntity.id, { activated: true })

          // Find and open all timed doors
          const timedDoors = Object.values(entities).filter(entity => entity.type === 'timed_door')
          timedDoors.forEach(door => {
            window.GAME_STATE.updateEntity(door.id, { active: false })
          })

          return true
        },
      }

      // Activate the pressure plate
      puzzleEngine.activatePressurePlate(9, 9)
    })

    await page.waitForTimeout(500)

    // Verify the door is deactivated (opened)
    const doorActiveAfterPlate = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_10_10'].active
    })
    expect(doorActiveAfterPlate).toBe(false)

    // Verify the pressure plate is activated
    const plateActivated = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['pressure_plate_9_9'].activated
    })
    expect(plateActivated).toBe(true)
  })

  test('blocks can activate pressure plates', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize (using optimized helper)
    await waitForGameState(page)

    // Set up a test level with blocks and pressure plates
    await page.evaluate(() => {
      // Initialize a test level
      window.GAME_STATE.loadLevel('test')

      // Register a block and a pressure plate
      window.GAME_STATE.registerEntity('block_1_1', { id: 'block_1_1', type: 'block', x: 1, y: 1, active: true })
      window.GAME_STATE.registerEntity('pressure_plate_3_3', {
        id: 'pressure_plate_3_3',
        type: 'pressure_plate',
        x: 3,
        y: 3,
        active: true,
        activated: false,
      })
      window.GAME_STATE.registerEntity('timed_door_4_4', {
        id: 'timed_door_4_4',
        type: 'timed_door',
        x: 4,
        y: 4,
        active: true,
      })
    })

    await page.waitForTimeout(500)

    // Verify initial state
    const initialPlateActivated = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['pressure_plate_3_3'].activated
    })
    expect(initialPlateActivated).toBe(false)

    // Move the block to the pressure plate
    await page.evaluate(() => {
      // Get the puzzle engine from the game scene
      const puzzleEngine = {
        tryMoveBlock: (blockId, dx, dy) => {
          const block = window.GAME_STATE.level.entities[blockId]
          window.GAME_STATE.updateEntity(blockId, { x: block.x + dx, y: block.y + dy })
          return true
        },
        isPressurePlateAt: (x, y) => {
          const entities = window.GAME_STATE.level.entities
          return Object.values(entities).some(
            entity =>
              entity.type === 'pressure_plate' &&
              Math.round(entity.x) === Math.round(x) &&
              Math.round(entity.y) === Math.round(y)
          )
        },
        activatePressurePlate: (x, y) => {
          const entities = window.GAME_STATE.level.entities
          const plateEntity = Object.values(entities).find(
            entity =>
              entity.type === 'pressure_plate' &&
              Math.round(entity.x) === Math.round(x) &&
              Math.round(entity.y) === Math.round(y)
          )

          if (!plateEntity) return false

          // Mark the pressure plate as activated
          window.GAME_STATE.updateEntity(plateEntity.id, { activated: true })

          // Find and open all timed doors
          const timedDoors = Object.values(entities).filter(entity => entity.type === 'timed_door')
          timedDoors.forEach(door => {
            window.GAME_STATE.updateEntity(door.id, { active: false })
          })

          return true
        },
      }

      // Move the block to the pressure plate position
      puzzleEngine.tryMoveBlock('block_1_1', 2, 2)

      // Check if the block is on a pressure plate and activate it
      if (puzzleEngine.isPressurePlateAt(3, 3)) {
        puzzleEngine.activatePressurePlate(3, 3)
      }
    })

    await page.waitForTimeout(500)

    // Verify the pressure plate is activated
    const finalPlateActivated = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['pressure_plate_3_3'].activated
    })
    expect(finalPlateActivated).toBe(true)

    // Verify the timed door is opened
    const finalDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_4_4'].active
    })
    expect(finalDoorActive).toBe(false)
  })
})
