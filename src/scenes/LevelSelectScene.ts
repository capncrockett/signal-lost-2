import Phaser from 'phaser'
import { AudioManager } from '../audio'
import { LEVELS } from '../levels'

/**
 * Level selection scene
 */
export default class LevelSelectScene extends Phaser.Scene {
  private audio!: AudioManager
  private title!: Phaser.GameObjects.Text
  private levelButtons: Phaser.GameObjects.Text[] = []
  private backButton!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'levelSelect' })
  }

  init(): void {
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
      'SELECT LEVEL',
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5)

    // Create level buttons
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

    // Get all level IDs
    const levelIds = Object.keys(LEVELS)

    // Create a button for each level
    levelIds.forEach((levelId, index) => {
      const level = LEVELS[levelId]
      const button = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.height * 0.2 + (index + 1) * 40,
        level.name,
        buttonStyle
      )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          button.setStyle(buttonHoverStyle)
        })
        .on('pointerout', () => {
          button.setStyle(buttonStyle)
        })
        .on('pointerdown', () => {
          this.audio.playNote('C4', '8n')
          this.scene.start('game', { levelId })
        })

      this.levelButtons.push(button)
    })

    // Create back button
    this.backButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height * 0.8,
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
        this.audio.playNote('E4', '8n')
        this.scene.start('menu')
      })

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

    // Track selected button
    let selectedButton = 0
    const buttons = [...this.levelButtons, this.backButton]

    // Highlight the first button by default
    if (buttons.length > 0) {
      buttons[selectedButton].setStyle({
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffff00',
        align: 'center'
      })
    }

    // Handle up key
    upKey.on('down', () => {
      if (buttons.length === 0) return

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
      if (buttons.length === 0) return

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
      if (buttons.length === 0) return

      // Play sound
      this.audio.playNote('C4', '8n')

      // Trigger the selected button
      if (selectedButton < this.levelButtons.length) {
        // Start the selected level
        const levelId = Object.keys(LEVELS)[selectedButton]
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
  }
}
