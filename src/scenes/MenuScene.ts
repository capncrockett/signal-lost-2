import Phaser from 'phaser'
import { AudioManager } from '../audio'

/**
 * Main menu scene for the game
 */
export default class MenuScene extends Phaser.Scene {
  private audio!: AudioManager
  private startButton!: Phaser.GameObjects.Text
  private levelSelectButton!: Phaser.GameObjects.Text
  private settingsButton!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'menu' })
  }

  init(): void {
    // Initialize audio
    this.audio = new AudioManager()
  }

  create(): void {
    // Create background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setAlpha(0.8)

    // Create title
    const title = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.2, 'SIGNAL LOST', {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    // Create buttons
    const buttonStyle = {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }

    const buttonHoverStyle = {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffff00',
      align: 'center',
    }

    // Start Game button
    this.startButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.4, 'Start Game', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.startButton.setStyle(buttonHoverStyle)
      })
      .on('pointerout', () => {
        this.startButton.setStyle(buttonStyle)
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
      .on('pointerover', () => {
        this.levelSelectButton.setStyle(buttonHoverStyle)
      })
      .on('pointerout', () => {
        this.levelSelectButton.setStyle(buttonStyle)
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
      .on('pointerover', () => {
        this.settingsButton.setStyle(buttonHoverStyle)
      })
      .on('pointerout', () => {
        this.settingsButton.setStyle(buttonStyle)
      })
      .on('pointerdown', () => {
        this.audio.playNote('E4', '8n')
        this.scene.start('settings')
      })

    // Version info
    this.add
      .text(this.cameras.main.width - 10, this.cameras.main.height - 10, 'v0.1.0', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#888888',
      })
      .setOrigin(1, 1)

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

    // Track selected button
    let selectedButton = 0
    const buttons = [this.startButton, this.levelSelectButton, this.settingsButton]

    // Highlight the first button by default
    this.startButton.setStyle({
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffff00',
      align: 'center',
    })

    // Handle up key
    upKey.on('down', () => {
      // Reset current button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      })

      // Move selection up
      selectedButton = (selectedButton - 1 + buttons.length) % buttons.length

      // Set new button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffff00',
        align: 'center',
      })

      // Play sound
      this.audio.playNote('A3', '32n')
    })

    // Handle down key
    downKey.on('down', () => {
      // Reset current button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      })

      // Move selection down
      selectedButton = (selectedButton + 1) % buttons.length

      // Set new button style
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffff00',
        align: 'center',
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
        this.scene.start('game', { levelId: 'start' })
      } else if (selectedButton === 1) {
        this.scene.start('levelSelect')
      } else if (selectedButton === 2) {
        this.scene.start('settings')
      }
    }

    enterKey.on('down', selectButton)
    spaceKey.on('down', selectButton)
  }
}
