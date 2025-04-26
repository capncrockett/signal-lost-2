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
  private interactFeedback?: Phaser.GameObjects.Rectangle
  // TODO: Implement movement blocking for obstacles
  // private movementBlocked = false
  private lastDirection = { x: 0, y: 0 }

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
    this.setBounce(0.1) // Add a small bounce for better feel
    this.setFriction(0.5, 0.5) // Add friction for smoother movement

    // Create visual feedback for interaction
    this.interactFeedback = config.scene.add.rectangle(this.x, this.y, 32, 32, 0xffff00, 0.3)
    this.interactFeedback.setVisible(false)

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
    let directionChanged = false

    // Reset velocity
    this.setVelocity(0)

    // Store current direction
    const currentDirection = { x: 0, y: 0 }

    // Horizontal movement
    if (this.cursors.left?.isDown) {
      this.setVelocityX(-speed)
      isMoving = true
      currentDirection.x = -1
    } else if (this.cursors.right?.isDown) {
      this.setVelocityX(speed)
      isMoving = true
      currentDirection.x = 1
    }

    // Vertical movement
    if (this.cursors.up?.isDown) {
      this.setVelocityY(-speed)
      isMoving = true
      currentDirection.y = -1
    } else if (this.cursors.down?.isDown) {
      this.setVelocityY(speed)
      isMoving = true
      currentDirection.y = 1
    }

    // Check if direction changed
    if (currentDirection.x !== this.lastDirection.x || currentDirection.y !== this.lastDirection.y) {
      directionChanged = true
      this.lastDirection = { ...currentDirection }
    }

    // Play movement sound (throttled)
    if (isMoving && this.audio && this.moveSound) {
      const currentTime = Date.now()
      if (currentTime - this.lastMoveTime > 200 || directionChanged) {
        // Play sound every 200ms while moving or when direction changes
        this.audio.playSoundEffect('move')
        this.lastMoveTime = currentTime
      }
    }

    // Try to push blocks in the direction of movement
    if (isMoving && this.puzzleEngine) {
      this.tryPushBlock(currentDirection.x, currentDirection.y)
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
    let interactionOccurred = false

    // Show visual feedback for interaction
    if (this.interactFeedback) {
      this.interactFeedback.setPosition(x * 32 + 16, y * 32 + 16)
      this.interactFeedback.setVisible(true)

      // Hide feedback after a short delay
      this.scene.time.delayedCall(300, () => {
        if (this.interactFeedback) {
          this.interactFeedback.setVisible(false)
        }
      })
    }

    // Check for keys to collect
    if (this.puzzleEngine.isKeyAt(x, y)) {
      interactionOccurred = this.puzzleEngine.collectKey(x, y)
    }

    // Check for locked doors to unlock
    if (this.puzzleEngine.isLockedDoorAt(x, y)) {
      interactionOccurred = this.puzzleEngine.tryUnlockDoor(x, y)
    }

    // Check for teleporters
    if (this.puzzleEngine.isTeleporterAt(x, y)) {
      const result = this.puzzleEngine.useTeleporter(x, y)
      if (result.success && result.newX !== undefined && result.newY !== undefined) {
        // Teleport the player
        this.setPosition(result.newX * 32 + 16, result.newY * 32 + 16)
        interactionOccurred = true
      }
    }

    // Check for switches
    if (this.puzzleEngine.isSwitchAt(x, y)) {
      interactionOccurred = this.puzzleEngine.activateSwitch(x, y)
    }

    // Play interaction sound if any interaction occurred
    if (interactionOccurred && this.audio) {
      this.audio.playNote('E5', '16n')
    }
  }

  /**
   * Try to push a block in the specified direction
   */
  private tryPushBlock(dx: number, dy: number): boolean {
    if (!this.puzzleEngine) return false

    const playerX = Math.round(this.x / 32)
    const playerY = Math.round(this.y / 32)

    // Check if there's a block in front of the player
    const blockX = playerX + dx
    const blockY = playerY + dy

    if (this.puzzleEngine.isBlockAt(blockX, blockY)) {
      // Get the block entity
      const blockEntity = Object.values(this.gameState.level.entities).find(
        entity => entity.type === 'block' && Math.round(entity.x) === blockX && Math.round(entity.y) === blockY
      )

      if (blockEntity) {
        // Try to move the block
        const blockMoved = this.puzzleEngine.tryMoveBlock(blockEntity.id, dx, dy)

        // Play sound effect if block moved
        if (blockMoved && this.audio) {
          this.audio.playSoundEffect('interact')
        }

        return blockMoved
      }
    }

    return false
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
