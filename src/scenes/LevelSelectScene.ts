import Phaser from 'phaser'
import { AudioManager } from '../audio'
import { LEVELS } from '../levels'
import { smallButtonStyle, smallButtonHoverStyle, smallButtonFocusStyle, subtitleStyle } from '../utils/menuStyles'

/**
 * Level selection scene
 */
export default class LevelSelectScene extends Phaser.Scene {
  private audio!: AudioManager
  private levelButtons: Phaser.GameObjects.Text[] = []
  private backButton!: Phaser.GameObjects.Text
  private focusIndicator!: Phaser.GameObjects.Rectangle
  private selectedButton = 0
  private buttons: Phaser.GameObjects.Text[] = []

  constructor() {
    super({ key: 'levelSelect', active: false, visible: false })
  }

  init(): void {
    // Initialize audio
    this.audio = new AudioManager()
  }

  create(): void {
    // Create background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setAlpha(0.8)

    // Create title
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.1, 'SELECT LEVEL', subtitleStyle)
      .setOrigin(0.5)
      .setData('test-id', 'level-select-title')
      .setData('ci-test-id', 'level-select-title')

    // Create focus indicator (initially hidden)
    this.focusIndicator = this.add
      .rectangle(0, 0, 200, 40, 0x333333)
      .setOrigin(0.5)
      .setAlpha(0)
      .setData('test-id', 'focus-indicator')
      .setData('ci-test-id', 'level-select-focus-indicator')

    // Reset buttons array
    this.levelButtons = []
    this.buttons = []

    // Get all level IDs
    const levelIds = Object.keys(LEVELS)

    // Create a button for each level
    levelIds.forEach((levelId, index) => {
      const level = LEVELS[levelId]
      const button = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.height * 0.2 + (index + 1) * 40,
          level.name,
          smallButtonStyle
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setData('test-id', `level-button-${levelId}`)
        .setData('ci-test-id', `level-select-button-${levelId}`)
        .setData('level-id', levelId)
        .on('pointerover', () => {
          if (this.selectedButton !== index) {
            button.setStyle(smallButtonHoverStyle)
          }
        })
        .on('pointerout', () => {
          if (this.selectedButton !== index) {
            button.setStyle(smallButtonStyle)
          }
        })
        .on('pointerdown', () => {
          this.audio.playNote('C4', '8n')
          this.scene.start('game', { levelId })
        })

      this.levelButtons.push(button)
    })

    // Create back button
    this.backButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.8, 'Back to Menu', smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'back-button')
      .setData('ci-test-id', 'level-select-back-button')
      .on('pointerover', () => {
        if (this.selectedButton !== this.levelButtons.length) {
          this.backButton.setStyle(smallButtonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== this.levelButtons.length) {
          this.backButton.setStyle(smallButtonStyle)
        }
      })
      .on('pointerdown', () => {
        this.audio.playNote('E4', '8n')
        this.scene.start('menu')
      })

    // Store all buttons in array for easier navigation
    this.buttons = [...this.levelButtons, this.backButton]

    // Play intro sound
    this.audio.playSequence(['E4', 'G4', 'C5'], ['8n', '8n', '4n'], '8n')

    // Set up keyboard events for audio control
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-M', () => {
        const muted = this.audio.toggleMute()
        console.log(`Audio ${muted ? 'muted' : 'unmuted'}`)
      })
    }

    // Add keyboard navigation
    this.setupKeyboardNavigation()

    // Set initial focus
    this.updateFocusIndicator()
  }

  /**
   * Set up keyboard navigation for the level select screen
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

    // Apply focus style to the first button if buttons exist
    if (this.buttons.length > 0) {
      this.buttons[this.selectedButton].setStyle(smallButtonFocusStyle)
    }

    // Handle up key
    upKey.on('down', () => {
      if (this.buttons.length === 0) return

      // Reset current button style
      this.buttons[this.selectedButton].setStyle(smallButtonStyle)

      // Move selection up
      this.selectedButton = (this.selectedButton - 1 + this.buttons.length) % this.buttons.length

      // Update focus indicator
      this.updateFocusIndicator()

      // Play sound
      this.audio.playNote('A3', '32n')
    })

    // Handle down key
    downKey.on('down', () => {
      if (this.buttons.length === 0) return

      // Reset current button style
      this.buttons[this.selectedButton].setStyle(smallButtonStyle)

      // Move selection down
      this.selectedButton = (this.selectedButton + 1) % this.buttons.length

      // Update focus indicator
      this.updateFocusIndicator()

      // Play sound
      this.audio.playNote('A3', '32n')
    })

    // Handle enter/space key
    const selectButton = () => {
      if (this.buttons.length === 0) return

      // Play sound
      this.audio.playNote('C4', '8n')

      // Trigger the selected button
      if (this.selectedButton < this.levelButtons.length) {
        // Start the selected level
        const levelId = this.levelButtons[this.selectedButton].getData('level-id')
        this.scene.start('game', { levelId })
      } else {
        // Back to menu
        this.scene.start('menu')
      }
    }

    enterKey.on('down', selectButton)
    spaceKey.on('down', selectButton)

    // Handle escape key (back to menu)
    escKey.on('down', () => {
      this.audio.playNote('E4', '8n')
      this.scene.start('menu')
    })

    // Handle mouse movement to update focus
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Check if pointer is over any button
      for (let i = 0; i < this.buttons.length; i++) {
        const button = this.buttons[i]
        if (button.getBounds().contains(pointer.x, pointer.y)) {
          // Reset previous button style
          this.buttons[this.selectedButton].setStyle(smallButtonStyle)

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
    button.setStyle(smallButtonFocusStyle)
  }
}
