import Phaser from 'phaser'
import { AudioManager } from '../audio'
import { GameState } from '../state'

/**
 * Settings scene for the game
 */
export default class SettingsScene extends Phaser.Scene {
  private audio!: AudioManager
  private gameState!: GameState
  private title!: Phaser.GameObjects.Text
  private audioButton!: Phaser.GameObjects.Text
  private moveSoundButton!: Phaser.GameObjects.Text
  private debugButton!: Phaser.GameObjects.Text
  private backButton!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'settings' })
  }

  init(data: { gameState?: GameState }): void {
    // Use provided game state or create a new one
    this.gameState = data.gameState || window.GAME_STATE

    // Initialize audio
    this.audio = new AudioManager()
  }

  create(): void {
    // Create background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
      .setOrigin(0, 0)
      .setAlpha(0.8)

    // Create title
    this.title = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height * 0.1,
      'SETTINGS',
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5)

    // Create settings buttons
    const buttonStyle = {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center'
    }

    const buttonHoverStyle = {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffff00',
      align: 'center'
    }

    // Audio toggle button
    const audioText = this.audio.isMuted() ? 'Audio: OFF' : 'Audio: ON'
    this.audioButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height * 0.3,
      audioText,
      buttonStyle
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.audioButton.setStyle(buttonHoverStyle)
      })
      .on('pointerout', () => {
        this.audioButton.setStyle(buttonStyle)
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
    this.moveSoundButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height * 0.4,
      moveSoundText,
      buttonStyle
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.moveSoundButton.setStyle(buttonHoverStyle)
      })
      .on('pointerout', () => {
        this.moveSoundButton.setStyle(buttonStyle)
      })
      .on('pointerdown', () => {
        this.gameState.player.moveSound = !this.gameState.player.moveSound
        this.moveSoundButton.setText(
          this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF'
        )
        this.audio.playNote('D4', '8n')
      })

    // Debug overlay toggle button
    const debugText = this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF'
    this.debugButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height * 0.5,
      debugText,
      buttonStyle
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.debugButton.setStyle(buttonHoverStyle)
      })
      .on('pointerout', () => {
        this.debugButton.setStyle(buttonStyle)
      })
      .on('pointerdown', () => {
        this.gameState.debug.showOverlay = !this.gameState.debug.showOverlay
        this.debugButton.setText(
          this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF'
        )
        this.audio.playNote('E4', '8n')
      })

    // Back button
    this.backButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height * 0.7,
      'Back to Menu',
      buttonStyle
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.backButton.setStyle(buttonHoverStyle)
      })
      .on('pointerout', () => {
        this.backButton.setStyle(buttonStyle)
      })
      .on('pointerdown', () => {
        this.audio.playNote('G4', '8n')
        this.scene.start('menu')
      })

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
        this.moveSoundButton.setText(
          this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF'
        )
        console.log(`Movement sounds ${this.gameState.player.moveSound ? 'enabled' : 'disabled'}`)
      })

      this.input.keyboard.on('keydown-D', () => {
        this.gameState.debug.showOverlay = !this.gameState.debug.showOverlay
        this.debugButton.setText(
          this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF'
        )
        console.log(`Debug overlay ${this.gameState.debug.showOverlay ? 'enabled' : 'disabled'}`)
      })
    }

    // Add keyboard navigation
    this.setupKeyboardNavigation()
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

    // Track selected button
    let selectedButton = 0
    const buttons = [this.audioButton, this.moveSoundButton, this.debugButton, this.backButton]

    // Highlight the first button by default
    buttons[selectedButton].setStyle({
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffff00',
      align: 'center'
    })

    // Handle up key
    upKey.on('down', () => {
      // Reset current button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center'
      })

      // Move selection up
      selectedButton = (selectedButton - 1 + buttons.length) % buttons.length

      // Set new button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffff00',
        align: 'center'
      })

      // Play sound
      this.audio.playNote('A3', '32n')
    })

    // Handle down key
    downKey.on('down', () => {
      // Reset current button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center'
      })

      // Move selection down
      selectedButton = (selectedButton + 1) % buttons.length

      // Set new button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffff00',
        align: 'center'
      })

      // Play sound
      this.audio.playNote('A3', '32n')
    })

    // Handle enter/space key
    const selectButton = () => {
      // Play sound
      this.audio.playNote('C4', '8n')

      // Trigger the selected button
      if (selectedButton === 0) {
        // Toggle audio
        const muted = this.audio.toggleMute()
        this.audioButton.setText(muted ? 'Audio: OFF' : 'Audio: ON')
      } else if (selectedButton === 1) {
        // Toggle movement sounds
        this.gameState.player.moveSound = !this.gameState.player.moveSound
        this.moveSoundButton.setText(
          this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF'
        )
      } else if (selectedButton === 2) {
        // Toggle debug overlay
        this.gameState.debug.showOverlay = !this.gameState.debug.showOverlay
        this.debugButton.setText(
          this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF'
        )
      } else if (selectedButton === 3) {
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
  }
}
