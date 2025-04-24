/**
 * Puzzle logic for block pushing, switches, etc.
 */

import { GameState } from './state'

export interface PuzzleConfig {
  gameState: GameState
}

export class PuzzleEngine {
  private gameState: GameState

  constructor(config: PuzzleConfig) {
    this.gameState = config.gameState
  }

  /**
   * Check if a block is at the given position
   */
  isBlockAt(x: number, y: number): boolean {
    const entities = this.gameState.level.entities
    return Object.values(entities).some(
      entity =>
        entity.type === 'block' && Math.round(entity.x) === Math.round(x) && Math.round(entity.y) === Math.round(y)
    )
  }

  /**
   * Check if a target is at the given position
   */
  isTargetAt(x: number, y: number): boolean {
    const entities = this.gameState.level.entities
    return Object.values(entities).some(
      entity =>
        entity.type === 'target' && Math.round(entity.x) === Math.round(x) && Math.round(entity.y) === Math.round(y)
    )
  }

  /**
   * Try to move a block in a direction
   */
  tryMoveBlock(blockId: string, dx: number, dy: number): boolean {
    const entities = this.gameState.level.entities
    const block = entities[blockId]

    if (!block || block.type !== 'block') {
      return false
    }

    const newX = block.x + dx
    const newY = block.y + dy

    // Check if the new position is valid (not a wall or another block)
    if (this.isBlockAt(newX, newY)) {
      return false
    }

    // Update block position
    this.gameState.updateEntity(blockId, { x: newX, y: newY })

    // Check if the block is on a target
    if (this.isTargetAt(newX, newY)) {
      this.checkPuzzleCompletion()
    }

    return true
  }

  /**
   * Check if all targets have blocks on them
   */
  checkPuzzleCompletion(): boolean {
    const entities = this.gameState.level.entities
    const targets = Object.values(entities).filter(entity => entity.type === 'target')

    // Check if all targets have blocks on them
    const allTargetsCovered = targets.every(target => this.isBlockAt(target.x, target.y))

    if (allTargetsCovered) {
      this.gameState.solveLevel()
      return true
    }

    return false
  }
}
