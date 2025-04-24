import Phaser from 'phaser'
import { GameState } from './state'
import { AudioManager } from './audio'
import { PuzzleEngine } from './puzzleEngine'

export interface PlayerConfig {
  scene: Phaser.Scene
  x: number
  y: number
  texture: string
  frame?: string | number
  gameState: GameState
  audio?: AudioManager
  puzzleEngine?: PuzzleEngine
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private gameState: GameState
  private audio?: AudioManager
  private puzzleEngine?: PuzzleEngine
  private speed = 100
  private lastMoveTime = 0
  private moveSound = false
  private interactKey: Phaser.Input.Keyboard.Key

  constructor(config: PlayerConfig) {
    super(config.scene, config.x, config.y, config.texture, config.frame)

    this.gameState = config.gameState
    this.audio = config.audio
    this.puzzleEngine = config.puzzleEngine

    // Add to scene
    config.scene.add.existing(this)
    config.scene.physics.add.existing(this)

    // Set up physics
    this.setCollideWorldBounds(true)

    // Set up input
    if (config.scene.input && config.scene.input.keyboard) {
      this.cursors = config.scene.input.keyboard.createCursorKeys()
      this.interactKey = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    } else {
      // Create empty cursor keys if keyboard is not available
      this.cursors = {
        up: { isDown: false },
        down: { isDown: false },
        left: { isDown: false },
        right: { isDown: false },
        space: { isDown: false },
        shift: { isDown: false },
      } as Phaser.Types.Input.Keyboard.CursorKeys
      this.interactKey = {} as Phaser.Input.Keyboard.Key
    }
  }

  update(): void {
    // Handle movement
    const speed = this.speed
    let isMoving = false

    // Reset velocity
    this.setVelocity(0)

    // Horizontal movement
    if (this.cursors.left?.isDown) {
      this.setVelocityX(-speed)
      isMoving = true
    } else if (this.cursors.right?.isDown) {
      this.setVelocityX(speed)
      isMoving = true
    }

    // Vertical movement
    if (this.cursors.up?.isDown) {
      this.setVelocityY(-speed)
      isMoving = true
    } else if (this.cursors.down?.isDown) {
      this.setVelocityY(speed)
      isMoving = true
    }

    // Play movement sound (throttled)
    if (isMoving && this.audio && this.moveSound) {
      const currentTime = Date.now()
      if (currentTime - this.lastMoveTime > 200) {
        // Play sound every 200ms while moving
        this.audio.playNote('C4', '32n')
        this.lastMoveTime = currentTime
      }
    }

    // Handle interaction with puzzle elements
    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey) && this.puzzleEngine) {
      this.interact()
    }

    // Update game state with player position
    this.gameState.updatePlayerPosition(this.x, this.y)
  }

  /**
   * Interact with puzzle elements at the player's position
   */
  private interact(): void {
    if (!this.puzzleEngine) return

    const x = Math.round(this.x / 32)
    const y = Math.round(this.y / 32)

    // Check for keys to collect
    if (this.puzzleEngine.isKeyAt(x, y)) {
      this.puzzleEngine.collectKey(x, y)
    }

    // Check for locked doors to unlock
    if (this.puzzleEngine.isLockedDoorAt(x, y)) {
      this.puzzleEngine.tryUnlockDoor(x, y)
    }

    // Check for teleporters
    if (this.puzzleEngine.isTeleporterAt(x, y)) {
      const result = this.puzzleEngine.useTeleporter(x, y)
      if (result.success && result.newX !== undefined && result.newY !== undefined) {
        // Teleport the player
        this.setPosition(result.newX * 32 + 16, result.newY * 32 + 16)
      }
    }

    // Check for switches
    if (this.puzzleEngine.isSwitchAt(x, y)) {
      this.puzzleEngine.activateSwitch(x, y)
    }
  }

  /**
   * Enable or disable movement sounds
   */
  setMoveSound(enabled: boolean): void {
    this.moveSound = enabled
  }

  /**
   * Toggle movement sounds
   */
  toggleMoveSound(): boolean {
    this.moveSound = !this.moveSound
    return this.moveSound
  }
}
