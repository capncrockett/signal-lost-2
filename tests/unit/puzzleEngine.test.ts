import { describe, it, expect, beforeEach } from 'vitest'
import { PuzzleEngine } from '../../src/puzzleEngine'
import { GameState } from '../../src/state'

describe('PuzzleEngine', () => {
  let gameState: GameState
  let puzzleEngine: PuzzleEngine
  
  beforeEach(() => {
    gameState = new GameState()
    puzzleEngine = new PuzzleEngine({ gameState })
    
    // Set up a simple puzzle with a block and a target
    gameState.registerEntity('block_1_1', { id: 'block_1_1', type: 'block', x: 1, y: 1, active: true })
    gameState.registerEntity('target_3_3', { id: 'target_3_3', type: 'target', x: 3, y: 3, active: true })
  })
  
  describe('isBlockAt', () => {
    it('should detect a block at the given position', () => {
      expect(puzzleEngine.isBlockAt(1, 1)).toBe(true)
      expect(puzzleEngine.isBlockAt(2, 2)).toBe(false)
    })
    
    it('should handle rounding for positions', () => {
      expect(puzzleEngine.isBlockAt(1.1, 0.9)).toBe(true)
    })
  })
  
  describe('isTargetAt', () => {
    it('should detect a target at the given position', () => {
      expect(puzzleEngine.isTargetAt(3, 3)).toBe(true)
      expect(puzzleEngine.isTargetAt(1, 1)).toBe(false)
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
  })
  
  describe('checkPuzzleCompletion', () => {
    it('should detect when all targets are covered by blocks', () => {
      // Move the block to the target
      gameState.updateEntity('block_1_1', { x: 3, y: 3 })
      
      const result = puzzleEngine.checkPuzzleCompletion()
      
      expect(result).toBe(true)
      expect(gameState.level.solved).toBe(true)
      expect(gameState.progress.puzzlesSolved).toBe(1)
    })
    
    it('should not mark the puzzle as solved if not all targets are covered', () => {
      const result = puzzleEngine.checkPuzzleCompletion()
      
      expect(result).toBe(false)
      expect(gameState.level.solved).toBe(false)
    })
  })
})
