/**
 * Puzzle logic for block pushing, switches, doors, keys, etc.
 */

import { GameState } from './state'
import { AudioManager } from './audio'

export interface PuzzleConfig {
  gameState: GameState
  audio?: AudioManager
}

export class PuzzleEngine {
  private gameState: GameState
  private audio?: AudioManager

  constructor(config: PuzzleConfig) {
    this.gameState = config.gameState
    this.audio = config.audio
  }

  /**
   * Check if an entity of a specific type is at the given position
   */
  private isEntityTypeAt(type: string, x: number, y: number): boolean {
    const entities = this.gameState.level.entities
    return Object.values(entities).some(
      entity =>
        entity.type === type &&
        Math.round(entity.x) === Math.round(x) &&
        Math.round(entity.y) === Math.round(y) &&
        entity.active !== false
    )
  }

  /**
   * Check if a block is at the given position
   */
  isBlockAt(x: number, y: number): boolean {
    return this.isEntityTypeAt('block', x, y)
  }

  /**
   * Check if a target is at the given position
   */
  isTargetAt(x: number, y: number): boolean {
    return this.isEntityTypeAt('target', x, y)
  }

  /**
   * Check if a switch is at the given position
   */
  isSwitchAt(x: number, y: number): boolean {
    return this.isEntityTypeAt('switch', x, y)
  }

  /**
   * Check if a door is at the given position
   */
  isDoorAt(x: number, y: number): boolean {
    return this.isEntityTypeAt('door', x, y)
  }

  /**
   * Check if a locked door is at the given position
   */
  isLockedDoorAt(x: number, y: number): boolean {
    return this.isEntityTypeAt('locked_door', x, y)
  }

  /**
   * Check if a key is at the given position
   */
  isKeyAt(x: number, y: number): boolean {
    return this.isEntityTypeAt('key', x, y)
  }

  /**
   * Check if a teleporter is at the given position
   */
  isTeleporterAt(x: number, y: number): boolean {
    return this.isEntityTypeAt('teleporter', x, y)
  }

  /**
   * Get entity at a specific position
   */
  getEntityAt(x: number, y: number): any {
    const entities = this.gameState.level.entities
    return Object.values(entities).find(
      entity =>
        Math.round(entity.x) === Math.round(x) && Math.round(entity.y) === Math.round(y) && entity.active !== false
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

    // Check if the new position is valid (not a wall, another block, or closed door)
    if (this.isBlockAt(newX, newY) || this.isDoorAt(newX, newY) || this.isLockedDoorAt(newX, newY)) {
      return false
    }

    // Update block position
    this.gameState.updateEntity(blockId, { x: newX, y: newY })

    // Check if the block is on a target
    if (this.isTargetAt(newX, newY)) {
      this.checkBlockPuzzleCompletion()
    }

    // Check if the block is on a switch
    if (this.isSwitchAt(newX, newY)) {
      this.activateSwitch(newX, newY)
    }

    return true
  }

  /**
   * Check if all targets have blocks on them
   */
  checkBlockPuzzleCompletion(): boolean {
    const entities = this.gameState.level.entities
    const targets = Object.values(entities).filter(entity => entity.type === 'target')

    // If there are no targets, this puzzle type doesn't apply
    if (targets.length === 0) {
      return false
    }

    // Check if all targets have blocks on them
    const allTargetsCovered = targets.every(target => this.isBlockAt(target.x, target.y))

    if (allTargetsCovered) {
      if (this.audio) {
        this.audio.playSoundEffect('levelComplete')
      }
      this.gameState.solveLevel()
      return true
    }

    return false
  }

  /**
   * Activate a switch at the given position
   */
  activateSwitch(x: number, y: number): boolean {
    const switchEntity = this.getEntityAt(x, y)

    if (!switchEntity || switchEntity.type !== 'switch') {
      return false
    }

    // Mark the switch as activated
    this.gameState.updateEntity(switchEntity.id, { activated: true })

    // Find and open all doors
    const entities = this.gameState.level.entities
    const doors = Object.values(entities).filter(entity => entity.type === 'door')

    doors.forEach(door => {
      this.gameState.updateEntity(door.id, { active: false })
    })

    if (this.audio) {
      this.audio.playSoundEffect('interact')
    }

    // Check if all switches are activated
    this.checkSwitchPuzzleCompletion()

    return true
  }

  /**
   * Check if all switches are activated
   */
  checkSwitchPuzzleCompletion(): boolean {
    const entities = this.gameState.level.entities
    const switches = Object.values(entities).filter(entity => entity.type === 'switch')

    // If there are no switches, this puzzle type doesn't apply
    if (switches.length === 0) {
      return false
    }

    // Check if all switches are activated
    const allSwitchesActivated = switches.every(switchEntity => switchEntity.activated === true)

    if (allSwitchesActivated) {
      if (this.audio) {
        this.audio.playSoundEffect('levelComplete')
      }
      this.gameState.solveLevel()
      return true
    }

    return false
  }

  /**
   * Collect a key at the given position
   */
  collectKey(x: number, y: number): boolean {
    const keyEntity = this.getEntityAt(x, y)

    if (!keyEntity || keyEntity.type !== 'key') {
      return false
    }

    // Add key to player inventory
    this.gameState.addToInventory(keyEntity.id)

    // Mark the key as collected (inactive)
    this.gameState.updateEntity(keyEntity.id, { active: false })

    if (this.audio) {
      this.audio.playSoundEffect('pickup')
    }

    // Add visual feedback
    try {
      const gameObject = keyEntity.gameObject
      if (gameObject && 'setTint' in gameObject) {
        const sprite = gameObject as Phaser.GameObjects.Image
        sprite.setTint(0xffff00)

        // Fade out the key
        if ('scene' in gameObject) {
          const scene = (gameObject as any).scene as Phaser.Scene
          scene.tweens.add({
            targets: gameObject,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              try {
                sprite.setVisible(false)
              } catch (error) {
                // Ignore errors in CI
              }
            },
          })
        }
      }
    } catch (error) {
      console.warn('Failed to show key collection feedback, likely running in CI environment:', error)
    }

    return true
  }

  /**
   * Try to unlock a door at the given position
   */
  tryUnlockDoor(x: number, y: number): boolean {
    const doorEntity = this.getEntityAt(x, y)

    if (!doorEntity || doorEntity.type !== 'locked_door') {
      return false
    }

    // Check if player has a key
    if (this.gameState.player.inventory.length === 0) {
      if (this.audio) {
        this.audio.playSoundEffect('error')
      }
      return false
    }

    // Use a key to unlock the door
    // Remove the first key from inventory
    this.gameState.player.inventory.splice(0, 1)

    // Mark the door as unlocked (inactive)
    this.gameState.updateEntity(doorEntity.id, { active: false })

    if (this.audio) {
      this.audio.playSoundEffect('unlock')
    }

    // Add visual feedback
    try {
      const gameObject = doorEntity.gameObject
      if (gameObject && 'setTint' in gameObject) {
        const sprite = gameObject as Phaser.GameObjects.Image
        sprite.setTint(0x00ff00)

        // Fade out the door
        if ('scene' in gameObject) {
          const scene = (gameObject as any).scene as Phaser.Scene
          scene.tweens.add({
            targets: gameObject,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              try {
                sprite.setVisible(false)
              } catch (error) {
                // Ignore errors in CI
              }
            },
          })
        }
      }
    } catch (error) {
      console.warn('Failed to show door unlock feedback, likely running in CI environment:', error)
    }

    // Check if all locked doors are unlocked
    this.checkKeyPuzzleCompletion()

    return true
  }

  /**
   * Check if all locked doors are unlocked
   */
  checkKeyPuzzleCompletion(): boolean {
    const entities = this.gameState.level.entities
    const lockedDoors = Object.values(entities).filter(
      entity => entity.type === 'locked_door' && entity.active !== false
    )

    // If there are no locked doors left, this puzzle type is complete
    if (lockedDoors.length === 0) {
      if (this.audio) {
        this.audio.playSoundEffect('levelComplete')
      }
      this.gameState.solveLevel()
      return true
    }

    return false
  }

  /**
   * Use a teleporter at the given position
   */
  useTeleporter(x: number, y: number): { success: boolean; newX?: number; newY?: number } {
    const teleporterEntity = this.getEntityAt(x, y)

    if (!teleporterEntity || teleporterEntity.type !== 'teleporter') {
      return { success: false }
    }

    // Find another teleporter to teleport to
    const entities = this.gameState.level.entities
    const otherTeleporters = Object.values(entities).filter(
      entity => entity.type === 'teleporter' && entity.id !== teleporterEntity.id && entity.active !== false
    )

    if (otherTeleporters.length === 0) {
      return { success: false }
    }

    // Choose the first other teleporter (could be random in the future)
    const targetTeleporter = otherTeleporters[0]

    if (this.audio) {
      this.audio.playSoundEffect('teleport')
    }

    return {
      success: true,
      newX: targetTeleporter.x,
      newY: targetTeleporter.y,
    }
  }

  /**
   * Check if the level is complete based on all puzzle types
   */
  checkLevelCompletion(): boolean {
    // Check all puzzle types
    const blockPuzzleComplete = this.checkBlockPuzzleCompletion()
    const switchPuzzleComplete = this.checkSwitchPuzzleCompletion()
    const keyPuzzleComplete = this.checkKeyPuzzleCompletion()

    // If any puzzle type is complete, the level is complete
    return blockPuzzleComplete || switchPuzzleComplete || keyPuzzleComplete
  }
}
