import Phaser from 'phaser'
import { AudioManager } from '../audio'
import { MusicManager } from '../musicManager'
import { GameState } from '../state'
import { smallButtonStyle, smallButtonHoverStyle, smallButtonFocusStyle, subtitleStyle } from '../utils/menuStyles'

/**
 * Settings scene for the game
 */
export default class SettingsScene extends Phaser.Scene {
  private audio!: AudioManager
  private music!: MusicManager
  private gameState!: GameState
  private audioButton!: Phaser.GameObjects.Text
  private moveSoundButton!: Phaser.GameObjects.Text
  private musicButton!: Phaser.GameObjects.Text
  private musicVolumeSlider!: Phaser.GameObjects.Rectangle
  private musicVolumeText!: Phaser.GameObjects.Text
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

    // Initialize music
    this.music = new MusicManager({ gameState: this.gameState })

    // Start settings music
    this.music.playTrack('settings')
  }

  create(): void {
    // Create background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0).setAlpha(0.8)

    // Create title
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.1, 'SETTINGS', subtitleStyle)
      .setOrigin(0.5)
      .setData('test-id', 'settings-title')
      .setData('ci-test-id', 'settings-title')

    // Create focus indicator (initially hidden)
    this.focusIndicator = this.add
      .rectangle(0, 0, 200, 40, 0x444444)
      .setOrigin(0.5)
      .setAlpha(0)
      .setData('test-id', 'focus-indicator')
      .setData('ci-test-id', 'settings-focus-indicator')

    // Add stroke style if available (might not be in test environment)
    try {
      this.focusIndicator.setStrokeStyle(2, 0xffff00)
    } catch (error) {
      console.warn('Could not set stroke style, likely running in test environment')
    }

    // Audio toggle button
    const audioText = this.audio.isMuted() ? 'Audio: OFF' : 'Audio: ON'
    this.audioButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.3, audioText, smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'audio-button')
      .setData('ci-test-id', 'settings-audio-button')
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
      .setData('ci-test-id', 'settings-move-sound-button')
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

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      })

    // Music toggle button
    const musicText = this.gameState.audio.musicEnabled ? 'Music: ON' : 'Music: OFF'
    this.musicButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.5, musicText, smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'music-button')
      .on('pointerover', () => {
        if (this.selectedButton !== 2) {
          this.musicButton.setStyle(smallButtonHoverStyle)
        }
      })
      .on('pointerout', () => {
        if (this.selectedButton !== 2) {
          this.musicButton.setStyle(smallButtonStyle)
        }
      })
      .on('pointerdown', () => {
        const enabled = this.music.toggleMusic()
        this.gameState.audio.musicEnabled = enabled
        this.musicButton.setText(enabled ? 'Music: ON' : 'Music: OFF')
        this.audio.playNote('E4', '8n')

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      })

    // Music volume slider
    const sliderWidth = 200
    const sliderHeight = 10
    const sliderX = this.cameras.main.centerX
    const sliderY = this.cameras.main.height * 0.55

    // Slider background
    this.add
      .rectangle(sliderX, sliderY, sliderWidth, sliderHeight, 0x333333)
      .setOrigin(0.5)
      .setData('test-id', 'music-volume-background')

    // Slider handle
    const handlePosition = sliderX - sliderWidth / 2 + this.gameState.audio.musicVolume * sliderWidth
    this.musicVolumeSlider = this.add
      .rectangle(handlePosition, sliderY, 20, 20, 0x00ff00)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true, draggable: true })
      .setData('test-id', 'music-volume-slider')

    // Volume text
    this.musicVolumeText = this.add
      .text(sliderX, sliderY + 20, `Volume: ${Math.round(this.gameState.audio.musicVolume * 100)}%`, smallButtonStyle)
      .setOrigin(0.5)
      .setData('test-id', 'music-volume-text')

    // Handle slider drag
    this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: any, dragX: number) => {
      if (gameObject === this.musicVolumeSlider) {
        // Calculate bounds
        const minX = sliderX - sliderWidth / 2
        const maxX = sliderX + sliderWidth / 2

        // Constrain to bounds
        const x = Phaser.Math.Clamp(dragX, minX, maxX)

        // Update slider position
        this.musicVolumeSlider.x = x

        // Calculate volume (0-1)
        const volume = (x - minX) / sliderWidth

        // Update volume
        this.gameState.setMusicVolume(volume)
        this.music.setVolume(volume)

        // Update text
        this.musicVolumeText.setText(`Volume: ${Math.round(volume * 100)}%`)

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      }
    })

    // Debug overlay toggle button
    const debugText = this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF'
    this.debugButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.6, debugText, smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'debug-button')
      .setData('ci-test-id', 'settings-debug-button')
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
      .text(this.cameras.main.centerX, this.cameras.main.height * 0.75, 'Back to Menu', smallButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setData('test-id', 'back-button')
      .setData('ci-test-id', 'settings-back-button')
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

        // Save state to localStorage
        this.gameState.saveToLocalStorage()

        // Transition back to menu with music change
        this.music.stopTrack(true, () => {
          this.scene.start('menu', {
            gameState: this.gameState,
          })
        })
      })

    // Store all buttons in array for easier navigation
    this.buttons = [this.audioButton, this.moveSoundButton, this.musicButton, this.debugButton, this.backButton]

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

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      } else if (this.selectedButton === 1) {
        // Toggle movement sounds
        this.gameState.player.moveSound = !this.gameState.player.moveSound
        this.moveSoundButton.setText(this.gameState.player.moveSound ? 'Movement Sounds: ON' : 'Movement Sounds: OFF')

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      } else if (this.selectedButton === 2) {
        // Toggle music
        const enabled = this.music.toggleMusic()
        this.gameState.audio.musicEnabled = enabled
        this.musicButton.setText(enabled ? 'Music: ON' : 'Music: OFF')

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      } else if (this.selectedButton === 3) {
        // Toggle debug overlay
        this.gameState.debug.showOverlay = !this.gameState.debug.showOverlay
        this.debugButton.setText(this.gameState.debug.showOverlay ? 'Debug Overlay: ON' : 'Debug Overlay: OFF')

        // Save state to localStorage
        this.gameState.saveToLocalStorage()
      } else if (this.selectedButton === 4) {
        // Back to menu
        // Save state to localStorage
        this.gameState.saveToLocalStorage()

        // Transition back to menu with music change
        this.music.stopTrack(true, () => {
          this.scene.start('menu', {
            gameState: this.gameState,
          })
        })
      }
    }

    enterKey.on('down', selectButton)
    spaceKey.on('down', selectButton)

    // Handle escape key (back to menu)
    escKey.on('down', () => {
      this.audio.playNote('G4', '8n')

      // Save state to localStorage
      this.gameState.saveToLocalStorage()

      // Transition back to menu with music change
      this.music.stopTrack(true, () => {
        this.scene.start('menu', {
          gameState: this.gameState,
        })
      })
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

    // Add a pulsing animation to make the focus indicator more visible
    try {
      this.tweens.add({
        targets: this.focusIndicator,
        alpha: { from: 0.7, to: 1 },
        duration: 700,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      })
    } catch (error) {
      console.warn('Could not add tween, likely running in test environment')
    }

    // Apply focus style to the button
    button.setStyle(smallButtonFocusStyle)
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
