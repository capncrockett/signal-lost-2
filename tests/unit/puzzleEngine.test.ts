import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PuzzleEngine } from '../../src/puzzleEngine'
import { GameState } from '../../src/state'
import { AudioManager } from '../../src/audio'

// Mock the AudioManager
vi.mock('../../src/audio', () => {
  return {
    AudioManager: vi.fn().mockImplementation(() => {
      return {
        playNote: vi.fn(),
        playSequence: vi.fn(),
        playSoundEffect: vi.fn(),
        toggleMute: vi.fn(),
        setMute: vi.fn(),
        isMuted: vi.fn(),
        dispose: vi.fn(),
      }
    }),
  }
})

describe('PuzzleEngine', () => {
  let gameState: GameState
  let puzzleEngine: PuzzleEngine
  let audio: AudioManager

  beforeEach(() => {
    gameState = new GameState()
    audio = new AudioManager()
    puzzleEngine = new PuzzleEngine({ gameState, audio })

    // Set up a simple puzzle with various elements
    gameState.registerEntity('block_1_1', { id: 'block_1_1', type: 'block', x: 1, y: 1, active: true })
    gameState.registerEntity('target_3_3', { id: 'target_3_3', type: 'target', x: 3, y: 3, active: true })
    gameState.registerEntity('switch_2_2', {
      id: 'switch_2_2',
      type: 'switch',
      x: 2,
      y: 2,
      active: true,
      activated: false,
    })
    gameState.registerEntity('door_4_4', { id: 'door_4_4', type: 'door', x: 4, y: 4, active: true })
    gameState.registerEntity('key_5_5', { id: 'key_5_5', type: 'key', x: 5, y: 5, active: true })
    gameState.registerEntity('locked_door_6_6', {
      id: 'locked_door_6_6',
      type: 'locked_door',
      x: 6,
      y: 6,
      active: true,
    })
    gameState.registerEntity('teleporter_7_7', { id: 'teleporter_7_7', type: 'teleporter', x: 7, y: 7, active: true })
    gameState.registerEntity('teleporter_8_8', { id: 'teleporter_8_8', type: 'teleporter', x: 8, y: 8, active: true })
  })

  describe('isEntityTypeAt', () => {
    it('should detect entities at the given position', () => {
      expect(puzzleEngine.isBlockAt(1, 1)).toBe(true)
      expect(puzzleEngine.isTargetAt(3, 3)).toBe(true)
      expect(puzzleEngine.isSwitchAt(2, 2)).toBe(true)
      expect(puzzleEngine.isDoorAt(4, 4)).toBe(true)
      expect(puzzleEngine.isKeyAt(5, 5)).toBe(true)
      expect(puzzleEngine.isLockedDoorAt(6, 6)).toBe(true)
      expect(puzzleEngine.isTeleporterAt(7, 7)).toBe(true)

      // Test negative cases
      expect(puzzleEngine.isBlockAt(2, 2)).toBe(false)
      expect(puzzleEngine.isTargetAt(1, 1)).toBe(false)
    })

    it('should handle rounding for positions', () => {
      expect(puzzleEngine.isBlockAt(1.1, 0.9)).toBe(true)
    })

    it('should respect the active state', () => {
      // Mark an entity as inactive
      gameState.updateEntity('block_1_1', { active: false })

      expect(puzzleEngine.isBlockAt(1, 1)).toBe(false)
    })
  })

  describe('getEntityAt', () => {
    it('should return the entity at the given position', () => {
      const entity = puzzleEngine.getEntityAt(1, 1)

      expect(entity).toBeDefined()
      expect(entity.id).toBe('block_1_1')
      expect(entity.type).toBe('block')
    })

    it('should return undefined if no entity is at the position', () => {
      const entity = puzzleEngine.getEntityAt(10, 10)

      expect(entity).toBeUndefined()
    })
  })

  describe('tryMoveBlock', () => {
    it('should move a block to a new position', () => {
      const result = puzzleEngine.tryMoveBlock('block_1_1', 1, 0)

      expect(result).toBe(true)
      expect(gameState.level.entities['block_1_1'].x).toBe(2)
      expect(gameState.level.entities['block_1_1'].y).toBe(1)
    })

    it('should not move a block if another block is in the way', () => {
      // Add another block
      gameState.registerEntity('block_2_1', { id: 'block_2_1', type: 'block', x: 2, y: 1, active: true })

      const result = puzzleEngine.tryMoveBlock('block_1_1', 1, 0)

      expect(result).toBe(false)
      expect(gameState.level.entities['block_1_1'].x).toBe(1)
      expect(gameState.level.entities['block_1_1'].y).toBe(1)
    })

    it('should not move a block if a door is in the way', () => {
      // Move door to block path
      gameState.updateEntity('door_4_4', { x: 2, y: 1 })

      const result = puzzleEngine.tryMoveBlock('block_1_1', 1, 0)

      expect(result).toBe(false)
      expect(gameState.level.entities['block_1_1'].x).toBe(1)
      expect(gameState.level.entities['block_1_1'].y).toBe(1)
    })
  })

  describe('checkBlockPuzzleCompletion', () => {
    it('should detect when all targets are covered by blocks', () => {
      // Move the block to the target
      gameState.updateEntity('block_1_1', { x: 3, y: 3 })

      const result = puzzleEngine.checkBlockPuzzleCompletion()

      expect(result).toBe(true)
      expect(gameState.level.solved).toBe(true)
      expect(gameState.progress.puzzlesSolved).toBe(1)
    })

    it('should not mark the puzzle as solved if not all targets are covered', () => {
      const result = puzzleEngine.checkBlockPuzzleCompletion()

      expect(result).toBe(false)
      expect(gameState.level.solved).toBe(false)
    })
  })

  describe('activateSwitch', () => {
    it('should activate a switch and open doors', () => {
      const result = puzzleEngine.activateSwitch(2, 2)

      expect(result).toBe(true)
      expect(gameState.level.entities['switch_2_2'].activated).toBe(true)
      expect(gameState.level.entities['door_4_4'].active).toBe(false)
    })

    it('should return false if no switch is at the position', () => {
      const result = puzzleEngine.activateSwitch(10, 10)

      expect(result).toBe(false)
    })
  })

  describe('checkSwitchPuzzleCompletion', () => {
    it('should detect when all switches are activated', () => {
      // Activate the switch
      gameState.updateEntity('switch_2_2', { activated: true })

      const result = puzzleEngine.checkSwitchPuzzleCompletion()

      expect(result).toBe(true)
      expect(gameState.level.solved).toBe(true)
    })

    it('should not mark the puzzle as solved if not all switches are activated', () => {
      const result = puzzleEngine.checkSwitchPuzzleCompletion()

      expect(result).toBe(false)
      expect(gameState.level.solved).toBe(false)
    })
  })

  describe('collectKey', () => {
    it('should collect a key and add it to inventory', () => {
      const result = puzzleEngine.collectKey(5, 5)

      expect(result).toBe(true)
      expect(gameState.level.entities['key_5_5'].active).toBe(false)
      expect(gameState.player.inventory).toContain('key_5_5')
    })

    it('should return false if no key is at the position', () => {
      const result = puzzleEngine.collectKey(10, 10)

      expect(result).toBe(false)
      expect(gameState.player.inventory.length).toBe(0)
    })
  })

  describe('tryUnlockDoor', () => {
    it('should unlock a door if player has a key', () => {
      // Add a key to inventory
      gameState.addToInventory('key_5_5')

      const result = puzzleEngine.tryUnlockDoor(6, 6)

      expect(result).toBe(true)
      expect(gameState.level.entities['locked_door_6_6'].active).toBe(false)
      expect(gameState.player.inventory.length).toBe(0) // Key should be used
    })

    it('should return false if player has no keys', () => {
      const result = puzzleEngine.tryUnlockDoor(6, 6)

      expect(result).toBe(false)
      expect(gameState.level.entities['locked_door_6_6'].active).toBe(true)
    })

    it('should return false if no locked door is at the position', () => {
      // Add a key to inventory
      gameState.addToInventory('key_5_5')

      const result = puzzleEngine.tryUnlockDoor(10, 10)

      expect(result).toBe(false)
      expect(gameState.player.inventory.length).toBe(1) // Key should not be used
    })
  })

  describe('useTeleporter', () => {
    it('should return the position of another teleporter', () => {
      const result = puzzleEngine.useTeleporter(7, 7)

      expect(result.success).toBe(true)
      expect(result.newX).toBe(8)
      expect(result.newY).toBe(8)
    })

    it('should return failure if no teleporter is at the position', () => {
      const result = puzzleEngine.useTeleporter(10, 10)

      expect(result.success).toBe(false)
      expect(result.newX).toBeUndefined()
      expect(result.newY).toBeUndefined()
    })

    it('should return failure if no other teleporter exists', () => {
      // Remove the other teleporter
      gameState.updateEntity('teleporter_8_8', { active: false })

      const result = puzzleEngine.useTeleporter(7, 7)

      expect(result.success).toBe(false)
    })
  })

  describe('checkLevelCompletion', () => {
    it('should check all puzzle types for completion', () => {
      // Spy on the individual completion methods
      const blockSpy = vi.spyOn(puzzleEngine, 'checkBlockPuzzleCompletion')
      const switchSpy = vi.spyOn(puzzleEngine, 'checkSwitchPuzzleCompletion')
      const keySpy = vi.spyOn(puzzleEngine, 'checkKeyPuzzleCompletion')

      puzzleEngine.checkLevelCompletion()

      expect(blockSpy).toHaveBeenCalled()
      expect(switchSpy).toHaveBeenCalled()
      expect(keySpy).toHaveBeenCalled()
    })
  })
})
