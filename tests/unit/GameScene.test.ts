import { describe, it, expect, vi, beforeEach } from 'vitest'
import GameScene from '../../src/scenes/GameScene'
import { GameState } from '../../src/state'
import { Player } from '../../src/player'
import { LevelData } from '../../src/levels'
import { AudioManager } from '../../src/audio'

// Mock the AudioManager
vi.mock('../../src/audio', () => {
  return {
    AudioManager: vi.fn().mockImplementation(() => {
      return {
        playNote: vi.fn(),
        playSequence: vi.fn(),
        playSoundEffect: vi.fn(),
        toggleMute: vi.fn(),
        setMute: vi.fn(),
        isMuted: vi.fn(),
        dispose: vi.fn(),
      }
    }),
  }
})

// Mock Phaser
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class {
        scene = { key: 'game' }
        constructor() {}
        add = {
          image: vi.fn().mockReturnThis(),
          text: vi.fn().mockReturnValue({
            setVisible: vi.fn().mockReturnThis(),
            setScrollFactor: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setText: vi.fn().mockReturnThis(),
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
            setStyle: vi.fn().mockReturnThis(),
          }),
          rectangle: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
          }),
        }
        cameras = {
          main: {
            width: 800,
            height: 600,
            centerX: 400,
            centerY: 300,
          },
        }
        physics = {
          add: {
            image: vi.fn().mockReturnValue({
              setImmovable: vi.fn(),
              setCollideWorldBounds: vi.fn(),
            }),
            collider: vi.fn(),
            sprite: vi.fn(),
          },
        }
        load = {
          setBaseURL: vi.fn(),
          image: vi.fn(),
        }
        input = {
          keyboard: {
            createCursorKeys: vi.fn().mockReturnValue({
              up: { isDown: false },
              down: { isDown: false },
              left: { isDown: false },
              right: { isDown: false },
            }),
            on: vi.fn(),
          },
        }
      },
      Physics: {
        Arcade: {
          Sprite: class {
            constructor() {}
            setCollideWorldBounds = vi.fn()
            setVelocity = vi.fn()
            setVelocityX = vi.fn()
            setVelocityY = vi.fn()
          },
        },
      },
    },
  }
})

// Mock dependencies
vi.mock('../../src/player', () => {
  return {
    Player: vi.fn().mockImplementation(() => {
      return {
        update: vi.fn(),
      }
    }),
  }
})

vi.mock('../../src/debugOverlay', () => {
  return {
    DebugOverlay: vi.fn().mockImplementation(() => {
      return {
        update: vi.fn(),
      }
    }),
  }
})

vi.mock('../../src/levels', () => {
  return {
    getLevel: vi.fn().mockImplementation(id => {
      return {
        id,
        name: `Level ${id}`,
        map: ['###', '#P#', '###'],
        entities: {
          player_1_1: { id: 'player_1_1', type: 'player', x: 1, y: 1 },
        },
      }
    }),
  }
})

describe('GameScene', () => {
  let gameScene: GameScene
  let gameState: GameState

  beforeEach(() => {
    gameState = new GameState()
    window.GAME_STATE = gameState

    gameScene = new GameScene()
    gameScene.init({ gameState, levelId: 'test' })
  })

  it('should initialize with the correct scene key', () => {
    expect(gameScene.scene.key).toBe('game')
  })

  it('should load the specified level', () => {
    expect(gameScene['currentLevel'].id).toBe('test')
    expect(gameScene['currentLevel'].name).toBe('Level test')
  })

  it('should create entities from the level data', () => {
    // Mock the createLevel method
    const createLevelSpy = vi.spyOn(gameScene as any, 'createLevel')
    createLevelSpy.mockImplementation(() => {})

    gameScene.create()

    expect(createLevelSpy).toHaveBeenCalled()
  })

  it('should update player and debug overlay', () => {
    // Set up player and debug overlay
    gameScene['player'] = new Player({} as any)
    gameScene['debugOverlay'] = { update: vi.fn() } as any

    gameScene.update()

    expect(gameScene['player'].update).toHaveBeenCalled()
    expect(gameScene['debugOverlay'].update).toHaveBeenCalled()
  })

  it('should get an entity by ID', () => {
    const mockEntity = { id: 'test-entity' }
    gameScene['entities'] = { 'test-entity': mockEntity as any }

    const result = gameScene.getEntityById('test-entity')

    expect(result).toBe(mockEntity)
  })
})
