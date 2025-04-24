import Phaser from 'phaser'
import { GameState } from './state'
import { AudioManager } from './audio'

export interface PlayerConfig {
  scene: Phaser.Scene
  x: number
  y: number
  texture: string
  frame?: string | number
  gameState: GameState
  audio?: AudioManager
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private gameState: GameState
  private audio?: AudioManager
  private speed = 100
  private lastMoveTime = 0
  private moveSound = false

  constructor(config: PlayerConfig) {
    super(config.scene, config.x, config.y, config.texture, config.frame)

    this.gameState = config.gameState
    this.audio = config.audio

    // Add to scene
    config.scene.add.existing(this)
    config.scene.physics.add.existing(this)

    // Set up physics
    this.setCollideWorldBounds(true)

    // Set up input
    if (config.scene.input.keyboard) {
      this.cursors = config.scene.input.keyboard.createCursorKeys()
    }
  }

  update(): void {
    // Handle movement
    const speed = this.speed
    let isMoving = false

    // Reset velocity
    this.setVelocity(0)

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.setVelocityX(-speed)
      isMoving = true
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(speed)
      isMoving = true
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.setVelocityY(-speed)
      isMoving = true
    } else if (this.cursors.down.isDown) {
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

    // Update game state with player position
    this.gameState.updatePlayerPosition(this.x, this.y)
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
