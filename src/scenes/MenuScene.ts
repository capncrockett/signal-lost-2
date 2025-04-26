import Phaser from 'phaser'
import { AudioManager } from '../audio'
import {
  buttonStyle,
  buttonHoverStyle,
  buttonFocusStyle,
  titleStyle
} from '../utils/menuStyles'

/**
 * Main menu scene for the game
 */
export default class MenuScene extends Phaser.Scene {
  private audio!: AudioManager
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
    // Initialize audio
    this.audio = new AudioManager()
  }

  create(): void {
    // Create background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setAlpha(0.8)

    // Create title
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.2, 'SIGNAL LOST', titleStyle)
      .setOrigin(0.5)
      .setData('test-id', 'title')

    // Create focus indicator (initially hidden)
    this.focusIndicator = this.add.rectangle(0, 0, 200, 40, 0x333333)
      .setOrigin(0.5)
      .setAlpha(0)
      .setData('test-id', 'focus-indicator')

    // Start Game button
    this.startButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.4, 'Start Game', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'start-button')
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
        this.scene.start('game', { levelId: 'start' })
      })

    // Level Select button
    this.levelSelectButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.5, 'Level Select', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'level-select-button')
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
        this.scene.start('levelSelect')
      })

    // Settings button
    this.settingsButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.6, 'Settings', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'settings-button')
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
        this.scene.start('settings')
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

    // Play intro music
    this.audio.playSequence(['C4', 'E4', 'G4', 'C5'], ['8n', '8n', '8n', '4n'], '8n')

    // Set up keyboard events for audio control
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-M', () => {
        const muted = this.audio.toggleMute()
        console.log(`Audio ${muted ? 'muted' : 'unmuted'}`)
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
        this.scene.start('game', { levelId: 'start' })
      } else if (this.selectedButton === 1) {
        this.scene.start('levelSelect')
      } else if (this.selectedButton === 2) {
        this.scene.start('settings')
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
        const button = this.buttons[i];
        if (button.getBounds().contains(pointer.x, pointer.y)) {
          // Reset previous button style
          this.buttons[this.selectedButton].setStyle(buttonStyle);

          // Update selected button
          this.selectedButton = i;

          // Update focus indicator
          this.updateFocusIndicator();

          break;
        }
      }
    });
  }

  /**
   * Update the focus indicator position and visibility
   */
  private updateFocusIndicator(): void {
    if (this.buttons.length === 0) return;

    // Get the currently selected button
    const button = this.buttons[this.selectedButton];

    // Update focus indicator position and size
    this.focusIndicator.setPosition(button.x, button.y);
    this.focusIndicator.setSize(button.width + 20, button.height + 10);

    // Make sure it's visible and behind the text
    this.focusIndicator.setAlpha(1);
    this.focusIndicator.setDepth(button.depth - 1);

    // Apply focus style to the button
    button.setStyle(buttonFocusStyle);
  }
}
