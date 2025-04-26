import Phaser from 'phaser'
import { GameState } from './state'

export class DebugOverlay {
  private scene: Phaser.Scene
  private gameState: GameState
  private textObjects: Phaser.GameObjects.Text[] = []
  private visible = true

  constructor(scene: Phaser.Scene, gameState: GameState) {
    this.scene = scene
    this.gameState = gameState

    // Initialize visibility from game state
    this.visible = this.gameState.debug.showOverlay

    // Create debug text objects
    this.createTextObjects()

    // Toggle visibility with D key
    if (this.scene.input && this.scene.input.keyboard) {
      this.scene.input.keyboard.on('keydown-D', () => {
        this.visible = !this.visible
        this.gameState.debug.showOverlay = this.visible
        this.updateVisibility()
      })
    }

    // Listen for changes to game state debug settings
    this.scene.events.on('update', () => {
      if (this.visible !== this.gameState.debug.showOverlay) {
        this.visible = this.gameState.debug.showOverlay
        this.updateVisibility()
      }
    })
  }

  private updateVisibility(): void {
    this.textObjects.forEach(text => {
      text.setVisible(this.visible)
    })
  }

  private createTextObjects(): void {
    // Player info
    this.textObjects.push(
      this.scene.add.text(10, 10, 'Player:', {
        fontSize: '16px',
        color: '#ffffff',
      })
    )

    // Level info
    this.textObjects.push(
      this.scene.add.text(10, 60, 'Level:', {
        fontSize: '16px',
        color: '#ffffff',
      })
    )

    // Progress info
    this.textObjects.push(
      this.scene.add.text(10, 110, 'Progress:', {
        fontSize: '16px',
        color: '#ffffff',
      })
    )

    // Set initial visibility based on game state
    this.visible = this.gameState.debug.showOverlay
    this.textObjects.forEach(text => {
      text.setVisible(this.visible)
      text.setScrollFactor(0) // Fixed to camera
      text.setDepth(1000) // Always on top
      text.setStroke('#000000', 2) // Add stroke for better visibility
    })
  }

  update(): void {
    // Check if overlay should be visible based on game state
    if (this.visible !== this.gameState.debug.showOverlay) {
      this.visible = this.gameState.debug.showOverlay
      this.updateVisibility()
    }

    if (!this.visible) return

    try {
      // Update player info
      const playerText = this.textObjects[0]
      playerText.setText(
        `Player:
        Position: (${Math.floor(this.gameState.player.x)}, ${Math.floor(this.gameState.player.y)})
        Health: ${this.gameState.player.health}
        Inventory: ${this.gameState.player.inventory.join(', ') || 'empty'}`
      )

      // Update level info
      const levelText = this.textObjects[1]
      levelText.setText(
        `Level:
        ID: ${this.gameState.level.id}
        Solved: ${this.gameState.level.solved ? 'Yes' : 'No'}
        Entities: ${Object.keys(this.gameState.level.entities).length}`
      )

      // Update progress info
      const progressText = this.textObjects[2]
      progressText.setText(
        `Progress:
        Levels: ${this.gameState.progress.levelsCompleted}
        Puzzles: ${this.gameState.progress.puzzlesSolved}
        Debug: ${this.gameState.debug.godMode ? 'GOD MODE' : 'Normal'}`
      )
    } catch (error) {
      console.error('Error updating debug overlay:', error)
    }
  }
}
