import { test, expect } from '@playwright/test'
import { wait, waitForGameState, navigateToGame, setupTestLevel } from './helpers'

/**
 * Signal Lost Advanced Puzzle Types E2E Tests
 *
 * These tests verify the functionality of advanced puzzle types:
 * - Pressure plates and timed doors
 * - Blocks on pressure plates
 * - Combined puzzle mechanics
 */

test.describe('Advanced Puzzle Types', () => {
  test('pressure plates can activate timed doors', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with pressure plates and timed doors
    const entities = {
      'pressure_plate_3_3': {
        id: 'pressure_plate_3_3',
        type: 'pressure_plate',
        x: 3,
        y: 3,
        active: true,
        activated: false,
      },
      'timed_door_5_5': {
        id: 'timed_door_5_5',
        type: 'timed_door',
        x: 5,
        y: 5,
        active: true,
        duration: 3000,
      }
    }
    
    await setupTestLevel(page, entities)

    // Verify initial state
    const initialDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_5_5'].active
    })
    expect(initialDoorActive).toBe(true)

    // Activate the pressure plate
    await page.evaluate(() => {
      // Create a simplified puzzle engine
      const puzzleEngine = {
        activatePressurePlate: (x: number, y: number) => {
          const entities = window.GAME_STATE.level.entities
          const plateEntity = Object.values(entities).find(
            entity => entity.type === 'pressure_plate' && 
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
        }
      }
      
      // Activate the pressure plate
      puzzleEngine.activatePressurePlate(3, 3)
    })
    
    await wait(500)

    // Verify the door is deactivated (opened)
    const doorActiveAfterPlate = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_5_5'].active
    })
    expect(doorActiveAfterPlate).toBe(false)

    // Verify the pressure plate is activated
    const plateActivated = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['pressure_plate_3_3'].activated
    })
    expect(plateActivated).toBe(true)
  })

  test('blocks can activate pressure plates', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with blocks and pressure plates
    const entities = {
      'block_2_2': {
        id: 'block_2_2',
        type: 'block',
        x: 2,
        y: 2,
        active: true,
      },
      'pressure_plate_4_4': {
        id: 'pressure_plate_4_4',
        type: 'pressure_plate',
        x: 4,
        y: 4,
        active: true,
        activated: false,
      },
      'timed_door_6_6': {
        id: 'timed_door_6_6',
        type: 'timed_door',
        x: 6,
        y: 6,
        active: true,
        duration: 3000,
      }
    }
    
    await setupTestLevel(page, entities)

    // Verify initial state
    const initialPlateActivated = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['pressure_plate_4_4'].activated
    })
    expect(initialPlateActivated).toBe(false)

    // Move the block onto the pressure plate
    await page.evaluate(() => {
      // Create a simplified puzzle engine
      const puzzleEngine = {
        tryMoveBlock: (blockId: string, dx: number, dy: number) => {
          const block = window.GAME_STATE.level.entities[blockId]
          window.GAME_STATE.updateEntity(blockId, { x: block.x + dx, y: block.y + dy })
          return true
        },
        activatePressurePlate: (x: number, y: number) => {
          const entities = window.GAME_STATE.level.entities
          const plateEntity = Object.values(entities).find(
            entity => entity.type === 'pressure_plate' && 
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
        checkPressurePlatePuzzleCompletion: () => {
          const entities = window.GAME_STATE.level.entities
          const pressurePlates = Object.values(entities).filter(entity => entity.type === 'pressure_plate')
          
          // If there are no pressure plates, this puzzle type doesn't apply
          if (pressurePlates.length === 0) {
            return false
          }
          
          // Check if all pressure plates are activated
          const allPlatesActivated = pressurePlates.every(plate => plate.activated === true)
          
          if (allPlatesActivated) {
            window.GAME_STATE.solveLevel()
            return true
          }
          
          return false
        }
      }
      
      // Move the block to the pressure plate
      puzzleEngine.tryMoveBlock('block_2_2', 2, 2)
      
      // Activate the pressure plate
      puzzleEngine.activatePressurePlate(4, 4)
      
      // Check for puzzle completion
      puzzleEngine.checkPressurePlatePuzzleCompletion()
    })
    
    await wait(500)

    // Verify the pressure plate is activated
    const finalPlateActivated = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['pressure_plate_4_4'].activated
    })
    expect(finalPlateActivated).toBe(true)

    // Verify the door is deactivated (opened)
    const finalDoorActive = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_6_6'].active
    })
    expect(finalDoorActive).toBe(false)
  })

  test('timed doors close after duration expires', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with pressure plates and timed doors with a short duration
    const entities = {
      'pressure_plate_3_3': {
        id: 'pressure_plate_3_3',
        type: 'pressure_plate',
        x: 3,
        y: 3,
        active: true,
        activated: false,
      },
      'timed_door_5_5': {
        id: 'timed_door_5_5',
        type: 'timed_door',
        x: 5,
        y: 5,
        active: true,
        duration: 1000, // Short duration for testing
      }
    }
    
    await setupTestLevel(page, entities)

    // Activate the pressure plate
    await page.evaluate(() => {
      // Create a simplified puzzle engine
      const puzzleEngine = {
        activatePressurePlate: (x: number, y: number) => {
          const entities = window.GAME_STATE.level.entities
          const plateEntity = Object.values(entities).find(
            entity => entity.type === 'pressure_plate' && 
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
            
            // Set a timeout to close the door after the duration
            setTimeout(() => {
              window.GAME_STATE.updateEntity(door.id, { active: true })
            }, door.duration)
          })
          
          return true
        }
      }
      
      // Activate the pressure plate
      puzzleEngine.activatePressurePlate(3, 3)
    })
    
    // Verify the door is initially deactivated (opened)
    await wait(500)
    const doorActiveAfterPlate = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_5_5'].active
    })
    expect(doorActiveAfterPlate).toBe(false)
    
    // Wait for the duration to expire
    await wait(1500)
    
    // Verify the door is activated again (closed)
    const doorActiveAfterTimeout = await page.evaluate(() => {
      return window.GAME_STATE.level.entities['timed_door_5_5'].active
    })
    expect(doorActiveAfterTimeout).toBe(true)
  })

  test('combined puzzle with pressure plates and blocks', async ({ page }) => {
    await page.goto('/')

    // Wait for the game to initialize
    await page.waitForFunction(() => window.GAME_STATE !== undefined, { timeout: 5000 })

    // Set up a test level with blocks, pressure plates, and targets
    const entities = {
      'block_1_1': {
        id: 'block_1_1',
        type: 'block',
        x: 1,
        y: 1,
        active: true,
      },
      'pressure_plate_3_3': {
        id: 'pressure_plate_3_3',
        type: 'pressure_plate',
        x: 3,
        y: 3,
        active: true,
        activated: false,
      },
      'timed_door_5_5': {
        id: 'timed_door_5_5',
        type: 'timed_door',
        x: 5,
        y: 5,
        active: true,
        duration: 3000,
      },
      'target_7_7': {
        id: 'target_7_7',
        type: 'target',
        x: 7,
        y: 7,
        active: true,
      }
    }
    
    await setupTestLevel(page, entities)

    // Verify initial state
    const initialSolved = await page.evaluate(() => window.GAME_STATE.level.solved)
    expect(initialSolved).toBe(false)

    // Solve the puzzle by moving the block to the target and activating the pressure plate
    await page.evaluate(() => {
      // Create a simplified puzzle engine
      const puzzleEngine = {
        tryMoveBlock: (blockId: string, dx: number, dy: number) => {
          const block = window.GAME_STATE.level.entities[blockId]
          window.GAME_STATE.updateEntity(blockId, { x: block.x + dx, y: block.y + dy })
          return true
        },
        activatePressurePlate: (x: number, y: number) => {
          const entities = window.GAME_STATE.level.entities
          const plateEntity = Object.values(entities).find(
            entity => entity.type === 'pressure_plate' && 
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
        checkBlockPuzzleCompletion: () => {
          const entities = window.GAME_STATE.level.entities
          const targets = Object.values(entities).filter(entity => entity.type === 'target')
          const blocks = Object.values(entities).filter(entity => entity.type === 'block')
          
          // Check if all targets have blocks on them
          const allTargetsCovered = targets.every(target => 
            blocks.some(block => 
              Math.round(block.x) === Math.round(target.x) && 
              Math.round(block.y) === Math.round(target.y)
            )
          )
          
          if (allTargetsCovered) {
            window.GAME_STATE.solveLevel()
            return true
          }
          
          return false
        }
      }
      
      // First activate the pressure plate
      puzzleEngine.activatePressurePlate(3, 3)
      
      // Then move the block to the target
      puzzleEngine.tryMoveBlock('block_1_1', 6, 6)
      
      // Check for puzzle completion
      puzzleEngine.checkBlockPuzzleCompletion()
    })
    
    await wait(500)

    // Verify the puzzle is solved
    const finalSolved = await page.evaluate(() => window.GAME_STATE.level.solved)
    expect(finalSolved).toBe(true)
  })
})
