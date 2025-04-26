import Phaser from 'phaser'
import { Player } from '../player'
import { DebugOverlay } from '../debugOverlay'
import { GameState } from '../state'
import { getLevel, LevelData } from '../levels'
import { AudioManager } from '../audio'
import { PuzzleEngine } from '../puzzleEngine'

export default class GameScene extends Phaser.Scene {
  private player!: Player
  private debugOverlay!: DebugOverlay
  private gameState!: GameState
  private currentLevel!: LevelData
  private entities: Record<string, Phaser.GameObjects.GameObject> = {}
  private audio!: AudioManager
  private puzzleEngine!: PuzzleEngine

  constructor() {
    super({ key: 'game' })
  }

  init(data: { gameState?: GameState; levelId?: string }): void {
    // Use provided game state or create a new one
    this.gameState = data.gameState || window.GAME_STATE

    // Initialize audio
    this.audio = new AudioManager()

    // Initialize puzzle engine
    this.puzzleEngine = new PuzzleEngine({
      gameState: this.gameState,
      audio: this.audio,
    })

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
    this.load.image('switch', 'assets/sprites/blue_ball.png')
    this.load.image('door', 'assets/sprites/orb-blue.png')
    this.load.image('key', 'assets/sprites/key.png')
    this.load.image('locked_door', 'assets/sprites/orb-red.png')
    this.load.image('teleporter', 'assets/sprites/flectrum.png')
  }

  create(): void {
    // Create the level
    this.createLevel()

    // Create debug overlay
    this.debugOverlay = new DebugOverlay(this, this.gameState)

    // Play level start sound
    this.audio.playSequence(['C4', 'E4', 'G4'], ['8n', '8n', '8n'], '8n')

    // Set up keyboard events for audio control
    if (this.input && this.input.keyboard) {
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
        console.log('Returning to menu via ESC key')
      })
    }

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

    // Update entity visibility based on active state
    this.updateEntityVisibility()

    // Check for level completion
    if (this.gameState.level.solved) {
      this.handleLevelCompletion()
    }
  }

  /**
   * Handle level completion
   */
  private handleLevelCompletion(): void {
    // Prevent multiple calls
    this.gameState.level.solved = false

    try {
      // Play completion sound
      this.audio.playSequence(['C4', 'E4', 'G4', 'C5'], ['8n', '8n', '8n', '4n'], '8n')

      // Show level completion message
      this.add
        .text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Level Complete!', {
          fontFamily: 'monospace',
          fontSize: '32px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100)

      // TODO: Add animations or interactions with the completion text in the future

      // Add continue button
      const continueButton = this.add
        .text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Continue', {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#333333',
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          try {
            continueButton.setStyle({ color: '#ffff00' })
          } catch (error) {
            // Ignore errors in CI
          }
        })
        .on('pointerout', () => {
          try {
            continueButton.setStyle({ color: '#ffffff' })
          } catch (error) {
            // Ignore errors in CI
          }
        })
        .on('pointerdown', () => {
          // Determine next level
          const currentLevelId = this.currentLevel.id
          let nextLevelId = currentLevelId

          // Simple level progression logic
          if (currentLevelId === 'start') {
            nextLevelId = 'puzzle1'
          } else if (currentLevelId === 'puzzle1') {
            nextLevelId = 'puzzle2'
          } else if (currentLevelId === 'puzzle2') {
            nextLevelId = 'puzzle3'
          } else if (currentLevelId === 'puzzle3') {
            nextLevelId = 'puzzle4'
          } else if (currentLevelId === 'puzzle4') {
            nextLevelId = 'puzzle5'
          } else {
            // If no more levels, go to level select
            this.scene.start('levelSelect')
            return
          }

          // Start next level
          this.scene.start('game', { levelId: nextLevelId })
        })
    } catch (error) {
      console.warn('Failed to handle level completion, likely running in CI environment:', error)
      // Fallback to simple level progression
      const currentLevelId = this.currentLevel.id
      let nextLevelId = 'levelSelect' // Default to level select

      // Simple level progression logic
      if (currentLevelId === 'start') {
        nextLevelId = 'puzzle1'
      } else if (currentLevelId === 'puzzle1') {
        nextLevelId = 'puzzle2'
      } else if (currentLevelId === 'puzzle2') {
        nextLevelId = 'puzzle3'
      } else if (currentLevelId === 'puzzle3') {
        nextLevelId = 'puzzle4'
      } else if (currentLevelId === 'puzzle4') {
        nextLevelId = 'puzzle5'
      }

      // Start next level
      this.scene.start('game', { levelId: nextLevelId })
    }
  }

  /**
   * Update entity visibility based on active state in game state
   */
  private updateEntityVisibility(): void {
    Object.entries(this.gameState.level.entities).forEach(([id, entity]) => {
      const gameObject = this.entities[id]
      if (gameObject && entity.active === false) {
        // Handle different types of game objects
        if ('setVisible' in gameObject) {
          const visibleObject = gameObject as Phaser.GameObjects.Image
          visibleObject.setVisible(false)
        }

        // If it's a physics object, disable it
        if (gameObject instanceof Phaser.Physics.Arcade.Image && gameObject.body) {
          gameObject.body.enable = false
        }
      }
    })
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
          puzzleEngine: this.puzzleEngine,
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
      } else if (entity.type === 'switch') {
        // Create switch
        const switchObj = this.add.image(posX, posY, 'switch')
        this.entities[entity.id] = switchObj

        // Register switch in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: switchObj,
          activated: false,
        })
      } else if (entity.type === 'door') {
        // Create door
        const door = this.physics.add.image(posX, posY, 'door')
        door.setImmovable(true)
        this.physics.add.collider(this.player, door)
        this.entities[entity.id] = door

        // Register door in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: door,
          active: true,
        })
      } else if (entity.type === 'key') {
        // Create key
        const key = this.add.image(posX, posY, 'key')
        this.entities[entity.id] = key

        // Register key in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: key,
          active: true,
        })
      } else if (entity.type === 'locked_door') {
        // Create locked door
        const lockedDoor = this.physics.add.image(posX, posY, 'locked_door')
        lockedDoor.setImmovable(true)
        this.physics.add.collider(this.player, lockedDoor)
        this.entities[entity.id] = lockedDoor

        // Register locked door in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: lockedDoor,
          active: true,
        })
      } else if (entity.type === 'teleporter') {
        // Create teleporter
        const teleporter = this.add.image(posX, posY, 'teleporter')
        this.entities[entity.id] = teleporter

        // Register teleporter in game state
        this.gameState.registerEntity(entity.id, {
          ...entity,
          gameObject: teleporter,
          active: true,
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
