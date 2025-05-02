import Phaser from 'phaser'
import { AudioManager } from '../audio'
import { MusicManager } from '../musicManager'
import { GameState } from '../state'
import { buttonStyle, buttonHoverStyle, buttonFocusStyle, titleStyle } from '../utils/menuStyles'

/**
 * Main menu scene for the game
 */
export default class MenuScene extends Phaser.Scene {
  private audio!: AudioManager
  private music!: MusicManager
  private gameState!: GameState
  private startButton!: Phaser.GameObjects.Text
  private levelSelectButton!: Phaser.GameObjects.Text
  private settingsButton!: Phaser.GameObjects.Text
  private focusIndicator!: Phaser.GameObjects.Rectangle
  private selectedButton = 0
  private buttons: Phaser.GameObjects.Text[] = []

  constructor() {
    super({ key: 'menu', active: false, visible: false })
  }

  init(): void {
    // Get game state
    this.gameState = window.GAME_STATE

    // Initialize audio
    this.audio = new AudioManager()

    // Initialize music
    this.music = new MusicManager({ gameState: this.gameState })
  }

  create(): void {
    // Create background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setAlpha(0.8)

    // Create title
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.2, 'SIGNAL LOST', titleStyle)
      .setOrigin(0.5)
      .setData('test-id', 'title')
      .setData('ci-test-id', 'menu-title')

    // Create focus indicator (initially hidden)
    this.focusIndicator = this.add
      .rectangle(0, 0, 200, 40, 0x444444)
      .setOrigin(0.5)
      .setAlpha(0)
      .setStrokeStyle(2, 0xffff00)
      .setData('test-id', 'focus-indicator')
      .setData('ci-test-id', 'menu-focus-indicator')

    // Start Game button
    this.startButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.4, 'Start Game', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'start-button')
      .setData('ci-test-id', 'menu-start-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 0) {
          this.startButton.setStyle(buttonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 0) {
          this.startButton.setStyle(buttonStyle)
        }
      })
      .on('pointerdown', () => {
        this.audio.playNote('C4', '8n')

        // Transition music
        this.music.stopTrack(true, () => {
          this.scene.start('game', {
            levelId: 'start',
            gameState: this.gameState,
          })
        })
      })

    // Level Select button
    this.levelSelectButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.5, 'Level Select', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'level-select-button')
      .setData('ci-test-id', 'menu-level-select-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 1) {
          this.levelSelectButton.setStyle(buttonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 1) {
          this.levelSelectButton.setStyle(buttonStyle)
        }
      })
      .on('pointerdown', () => {
        this.audio.playNote('D4', '8n')

        // Transition music (keep the same track for level select)
        this.scene.start('levelSelect', {
          gameState: this.gameState,
        })
      })

    // Settings button
    this.settingsButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.6, 'Settings', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'settings-button')
      .setData('ci-test-id', 'menu-settings-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 2) {
          this.settingsButton.setStyle(buttonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 2) {
          this.settingsButton.setStyle(buttonStyle)
        }
      })
      .on('pointerdown', () => {
        this.audio.playNote('E4', '8n')

        // Transition to settings scene with music change
        this.music.stopTrack(true, () => {
          this.scene.start('settings', {
            gameState: this.gameState,
          })
        })
      })

    // Store buttons in array for easier navigation
    this.buttons = [this.startButton, this.levelSelectButton, this.settingsButton]

    // Version info
    this.add
      .text(this.cameras.main.width - 10, this.cameras.main.height - 10, 'v0.1.0', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#888888',
      })
      .setOrigin(1, 1)
      .setData('test-id', 'version-info')
      .setData('ci-test-id', 'menu-version-info')

    // Play intro sound effect
    this.audio.playSequence(['C4', 'E4', 'G4', 'C5'], ['8n', '8n', '8n', '4n'], '8n')

    // Start background music
    this.music.playTrack('menu')

    // Save state to localStorage
    this.gameState.saveToLocalStorage()

    // Set up keyboard events for audio control
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-M', () => {
        // Toggle both sound effects and music
        const muted = this.audio.toggleMute()
        this.gameState.audio.sfxEnabled = !muted

        // Update music based on mute state
        if (muted) {
          this.music.setVolume(0)
        } else {
          this.music.setVolume(this.gameState.audio.musicVolume)
        }

        console.log(`Audio ${muted ? 'muted' : 'unmuted'}`)

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      })
    }

    // Add keyboard navigation for menu
    this.setupKeyboardNavigation()

    // Set initial focus
    this.updateFocusIndicator()
  }

  /**
   * Set up keyboard navigation for the menu
   */
  private setupKeyboardNavigation(): void {
    if (!this.input.keyboard) return

    // Add keyboard navigation
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

    // Set initial selected button
    this.selectedButton = 0

    // Apply focus style to the first button
    this.buttons[this.selectedButton].setStyle(buttonFocusStyle)

    // Handle up key
    upKey.on('down', () => {
      // Reset current button style
      this.buttons[this.selectedButton].setStyle(buttonStyle)

      // Move selection up
      this.selectedButton = (this.selectedButton - 1 + this.buttons.length) % this.buttons.length

      // Update focus indicator
      this.updateFocusIndicator()

      // Play sound
      this.audio.playNote('A3', '32n')
    })

    // Handle down key
    downKey.on('down', () => {
      // Reset current button style
      this.buttons[this.selectedButton].setStyle(buttonStyle)

      // Move selection down
      this.selectedButton = (this.selectedButton + 1) % this.buttons.length

      // Update focus indicator
      this.updateFocusIndicator()

      // Play sound
      this.audio.playNote('A3', '32n')
    })

    // Handle enter/space key
    const selectButton = () => {
      // Play sound
      this.audio.playNote('C4', '8n')

      // Trigger the selected button
      if (this.selectedButton === 0) {
        // Transition music
        this.music.stopTrack(true, () => {
          this.scene.start('game', {
            levelId: 'start',
            gameState: this.gameState,
          })
        })
      } else if (this.selectedButton === 1) {
        // Keep the same music for level select
        this.scene.start('levelSelect', {
          gameState: this.gameState,
        })
      } else if (this.selectedButton === 2) {
        // Transition to settings scene with music change
        this.music.stopTrack(true, () => {
          this.scene.start('settings', {
            gameState: this.gameState,
          })
        })
      }
    }

    enterKey.on('down', selectButton)
    spaceKey.on('down', selectButton)

    // Handle escape key (no action in main menu, but added for consistency)
    escKey.on('down', () => {
      // Play sound
      this.audio.playNote('E4', '8n')
      // No action in main menu
    })

    // Handle mouse movement to update focus
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Check if pointer is over any button
      for (let i = 0; i < this.buttons.length; i++) {
        const button = this.buttons[i]
        if (button.getBounds().contains(pointer.x, pointer.y)) {
          // Reset previous button style
          this.buttons[this.selectedButton].setStyle(buttonStyle)

          // Update selected button
          this.selectedButton = i

          // Update focus indicator
          this.updateFocusIndicator()

          break
        }
      }
    })
  }

  /**
   * Update the focus indicator position and visibility
   */
  private updateFocusIndicator(): void {
    if (this.buttons.length === 0) return

    // Get the currently selected button
    const button = this.buttons[this.selectedButton]

    // Update focus indicator position and size
    this.focusIndicator.setPosition(button.x, button.y)
    this.focusIndicator.setSize(button.width + 20, button.height + 10)

    // Make sure it's visible and behind the text
    this.focusIndicator.setAlpha(1)
    this.focusIndicator.setDepth(button.depth - 1)

    // Apply focus style to the button
    button.setStyle(buttonFocusStyle)
  }

  /**
   * Clean up resources when scene is shut down
   */
  shutdown(): void {
    // Clean up music resources
    if (this.music) {
      this.music.dispose()
    }

    // Clean up audio resources
    if (this.audio) {
      this.audio.dispose()
    }

    // Save state to localStorage
    this.gameState.saveToLocalStorage()
  }
}
