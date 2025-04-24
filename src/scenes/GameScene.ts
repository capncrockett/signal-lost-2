import Phaser from 'phaser'
import { Player } from '../player'
import { DebugOverlay } from '../debugOverlay'
import { GameState } from '../state'
import { getLevel, LevelData } from '../levels'
import { AudioManager } from '../audio'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private debugOverlay!: DebugOverlay
  private gameState!: GameState
  private currentLevel!: LevelData
  private entities: Record<string, Phaser.GameObjects.GameObject> = {}
  private audio!: AudioManager

  constructor() {
    super({ key: 'game' })
  }

  init(data: { gameState?: GameState; levelId?: string }): void {
    // Use provided game state or create a new one
    this.gameState = data.gameState || window.GAME_STATE

    // Initialize audio
    this.audio = new AudioManager()

    // Load the specified level or the default one
    const levelId = data.levelId || 'start'
    this.currentLevel = getLevel(levelId)
    this.gameState.loadLevel(levelId)
  }

  preload(): void {
    // Load temporary placeholder assets
    this.load.setBaseURL('https://labs.phaser.io')
    this.load.image('player', 'assets/sprites/phaser-dude.png')
    this.load.image('wall', 'assets/sprites/block.png')
    this.load.image('floor', 'assets/sprites/checker.png')
    this.load.image('block', 'assets/sprites/crate32.png')
    this.load.image('target', 'assets/sprites/red_ball.png')
  }

  create(): void {
    // Create the level
    this.createLevel()

    // Create debug overlay
    this.debugOverlay = new DebugOverlay(this, this.gameState)

    // Play level start sound
    this.audio.playSequence(['C4', 'E4', 'G4'], ['8n', '8n', '8n'], '8n')

    // Set up keyboard events for audio control
    this.input.keyboard.on('keydown-M', () => {
      const muted = this.audio.toggleMute()
      console.log(`Audio ${muted ? 'muted' : 'unmuted'}`)
    })

    // Set up keyboard events for player movement sounds
    this.input.keyboard.on('keydown-S', () => {
      if (this.player) {
        const enabled = this.player.toggleMoveSound()
        console.log(`Movement sounds ${enabled ? 'enabled' : 'disabled'}`)
      }
    })

    // Set up keyboard event for returning to menu
    this.input.keyboard.on('keydown-ESC', () => {
      this.audio.playNote('E4', '8n')
      this.scene.start('menu')
    })

    // Add menu button
    const menuButton = this.add
      .text(this.cameras.main.width - 10, 10, 'Menu', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        menuButton.setStyle({ color: '#ffff00' })
      })
      .on('pointerout', () => {
        menuButton.setStyle({ color: '#ffffff' })
      })
      .on('pointerdown', () => {
        this.audio.playNote('E4', '8n')
        this.scene.start('menu')
      })
  }

  update(): void {
    // Update player
    if (this.player) {
      this.player.update()
    }

    // Update debug overlay
    if (this.debugOverlay) {
      this.debugOverlay.update()
    }
  }

  private createLevel(): void {
    const level = this.currentLevel
    const tileSize = 32

    // Create tilemap
    for (let y = 0; y < level.map.length; y++) {
      for (let x = 0; x < level.map[y].length; x++) {
        const char = level.map[y][x]
        const posX = x * tileSize + tileSize / 2
        const posY = y * tileSize + tileSize / 2

        // Create floor tiles everywhere except empty spaces
        if (char !== ' ') {
          this.add.image(posX, posY, 'floor')
        }

        // Create walls
        if (char === '#') {
          const wall = this.physics.add.image(posX, posY, 'wall')
          wall.setImmovable(true)
          this.entities[`wall_${x}_${y}`] = wall
        }
      }
    }

    // Create entities from the level data
    Object.values(level.entities).forEach(entity => {
      const posX = entity.x * tileSize + tileSize / 2
      const posY = entity.y * tileSize + tileSize / 2

      if (entity.type === 'player') {
        // Create player
        this.player = new Player({
          scene: this,
          x: posX,
          y: posY,
          texture: 'player',
          gameState: this.gameState,
          audio: this.audio,
        })
        this.entities[entity.id] = this.player

        // Register player in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: this.player,
        })
      } else if (entity.type === 'block') {
        // Create movable block
        const block = this.physics.add.image(posX, posY, 'block')
        block.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, block)
        this.entities[entity.id] = block

        // Register block in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: block,
        })
      } else if (entity.type === 'target') {
        // Create target
        const target = this.add.image(posX, posY, 'target')
        this.entities[entity.id] = target

        // Register target in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: target,
        })
      }
    })

    // Set up collisions between player and walls
    Object.entries(this.entities).forEach(([id, entity]) => {
      if (id.startsWith('wall_') && this.player) {
        this.physics.add.collider(this.player, entity as Phaser.Physics.Arcade.Image)
      }
    })
  }

  /**
   * Get an entity by ID
   */
  getEntityById(id: string): Phaser.GameObjects.GameObject | undefined {
    return this.entities[id]
  }
}
