import Phaser from 'phaser'
import { AudioManager } from '../audio'
import { GameState } from '../state'
import {
  smallButtonStyle,
  smallButtonHoverStyle,
  smallButtonFocusStyle,
  subtitleStyle
} from '../utils/menuStyles'

/**
 * Settings scene for the game
 */
export default class SettingsScene extends Phaser.Scene {
  private audio!: AudioManager
  private gameState!: GameState
  private audioButton!: Phaser.GameObjects.Text
  private moveSoundButton!: Phaser.GameObjects.Text
  private debugButton!: Phaser.GameObjects.Text
  private backButton!: Phaser.GameObjects.Text
  private focusIndicator!: Phaser.GameObjects.Rectangle
  private selectedButton = 0
  private buttons: Phaser.GameObjects.Text[] = []

  constructor() {
    super({ key: 'settings', active: false, visible: false })
  }

  init(data: { gameState?: GameState }): void {
    // Use provided game state or create a new one
    this.gameState = data.gameState || window.GAME_STATE

    // Initialize audio
    this.audio = new AudioManager()
  }

  create(): void {
    // Create background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setAlpha(0.8)

    // Create title
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.1, 'SETTINGS', subtitleStyle)
      .setOrigin(0.5)
      .setData('test-id', 'settings-title')

    // Create focus indicator (initially hidden)
    this.focusIndicator = this.add.rectangle(0, 0, 200, 40, 0x333333)
      .setOrigin(0.5)
      .setAlpha(0)
      .setData('test-id', 'focus-indicator')

    // Audio toggle button
    const audioText = this.audio.isMuted() ? 'Audio: OFF' : 'Audio: ON'
    this.audioButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.3, audioText, smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'audio-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 0) {
          this.audioButton.setStyle(smallButtonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 0) {
          this.audioButton.setStyle(smallButtonStyle)
        }
      })
      .on('pointerdown', () => {
        const muted = this.audio.toggleMute()
        this.audioButton.setText(muted ? 'Audio: OFF' : 'Audio: ON')
        if (!muted) {
          this.audio.playNote('C4', '8n')
        }
      })

    // Movement sound toggle button
    const moveSoundText = this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF'
    this.moveSoundButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.4, moveSoundText, smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'move-sound-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 1) {
          this.moveSoundButton.setStyle(smallButtonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 1) {
          this.moveSoundButton.setStyle(smallButtonStyle)
        }
      })
      .on('pointerdown', () => {
        this.gameState.player.moveSound = !this.gameState.player.moveSound
        this.moveSoundButton.setText(this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF')
        this.audio.playNote('D4', '8n')
      })

    // Debug overlay toggle button
    const debugText = this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF'
    this.debugButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.5, debugText, smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'debug-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 2) {
          this.debugButton.setStyle(smallButtonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 2) {
          this.debugButton.setStyle(smallButtonStyle)
        }
      })
      .on('pointerdown', () => {
        this.gameState.debug.showOverlay = !this.gameState.debug.showOverlay
        this.debugButton.setText(this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF')
        this.audio.playNote('E4', '8n')
      })

    // Back button
    this.backButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.7, 'Back to Menu', smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'back-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 3) {
          this.backButton.setStyle(smallButtonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 3) {
          this.backButton.setStyle(smallButtonStyle)
        }
      })
      .on('pointerdown', () => {
        this.audio.playNote('G4', '8n')
        this.scene.start('menu')
      })

    // Store all buttons in array for easier navigation
    this.buttons = [this.audioButton, this.moveSoundButton, this.debugButton, this.backButton]

    // Play intro sound
    this.audio.playSequence(['G4', 'E4', 'C4'], ['8n', '8n', '4n'], '8n')

    // Set up keyboard events for audio control
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-M', () => {
        const muted = this.audio.toggleMute()
        this.audioButton.setText(muted ? 'Audio: OFF' : 'Audio: ON')
        console.log(`Audio ${muted ? 'muted' : 'unmuted'}`)
      })

      this.input.keyboard.on('keydown-S', () => {
        this.gameState.player.moveSound = !this.gameState.player.moveSound
        this.moveSoundButton.setText(this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF')
        console.log(`Movement sounds ${this.gameState.player.moveSound ? 'enabled' : 'disabled'}`)
      })

      this.input.keyboard.on('keydown-D', () => {
        this.gameState.debug.showOverlay = !this.gameState.debug.showOverlay
        this.debugButton.setText(this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF')
        console.log(`Debug overlay ${this.gameState.debug.showOverlay ? 'enabled' : 'disabled'}`)
      })
    }

    // Add keyboard navigation
    this.setupKeyboardNavigation()

    // Set initial focus
    this.updateFocusIndicator()
  }

  /**
   * Set up keyboard navigation for the settings screen
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
    this.buttons[this.selectedButton].setStyle(smallButtonFocusStyle)

    // Handle up key
    upKey.on('down', () => {
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
      // Play sound
      this.audio.playNote('C4', '8n')

      // Trigger the selected button
      if (this.selectedButton === 0) {
        // Toggle audio
        const muted = this.audio.toggleMute()
        this.audioButton.setText(muted ? 'Audio: OFF' : 'Audio: ON')
      } else if (this.selectedButton === 1) {
        // Toggle movement sounds
        this.gameState.player.moveSound = !this.gameState.player.moveSound
        this.moveSoundButton.setText(this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF')
      } else if (this.selectedButton === 2) {
        // Toggle debug overlay
        this.gameState.debug.showOverlay = !this.gameState.debug.showOverlay
        this.debugButton.setText(this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF')
      } else if (this.selectedButton === 3) {
        // Back to menu
        this.scene.start('menu')
      }
    }

    enterKey.on('down', selectButton)
    spaceKey.on('down', selectButton)

    // Handle escape key (back to menu)
    escKey.on('down', () => {
      this.audio.playNote('G4', '8n')
      this.scene.start('menu')
    })

    // Handle mouse movement to update focus
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Check if pointer is over any button
      for (let i = 0; i < this.buttons.length; i++) {
        const button = this.buttons[i];
        if (button.getBounds().contains(pointer.x, pointer.y)) {
          // Reset previous button style
          this.buttons[this.selectedButton].setStyle(smallButtonStyle);

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
    button.setStyle(smallButtonFocusStyle);
  }
}
