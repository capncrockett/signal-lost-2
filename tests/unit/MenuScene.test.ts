import { describe, it, expect, beforeEach, vi } from 'vitest'
import MenuScene from '../../src/scenes/MenuScene'
import { GameState } from '../../src/state'

// Mock Phaser
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class {
        scene = { key: 'menu' }
        constructor() {}
        add: any = {
          text: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
            setStyle: vi.fn().mockReturnThis(),
            setData: vi.fn().mockReturnThis(),
          }),
          rectangle: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setSize: vi.fn().mockReturnThis(),
            setPosition: vi.fn().mockReturnThis(),
            setData: vi.fn().mockReturnThis(),
          }),
        }
        cameras: any = {
          main: {
            width: 800,
            height: 600,
            centerX: 400,
            centerY: 300,
          },
        }
        input: any = {
          keyboard: {
            on: vi.fn(),
            addKey: vi.fn().mockReturnValue({
              on: vi.fn(),
            }),
          },
          on: vi.fn(),
        }
        scene: any = {
          start: vi.fn(),
          key: 'menu',
        }
      },
      Input: {
        Keyboard: {
          KeyCodes: {
            UP: 38,
            DOWN: 40,
            ENTER: 13,
            SPACE: 32,
            ESC: 27,
          },
        },
      },
      BlendModes: {
        ADD: 1,
      },
    },
  }
})

// Mock AudioManager
vi.mock('../../src/audio', () => {
  return {
    AudioManager: vi.fn().mockImplementation(() => {
      return {
        playNote: vi.fn(),
        playSequence: vi.fn(),
        toggleMute: vi.fn().mockReturnValue(false),
        isMuted: vi.fn().mockReturnValue(false),
        dispose: vi.fn(),
      }
    }),
  }
})

// Mock MusicManager
vi.mock('../../src/musicManager', () => {
  return {
    MusicManager: vi.fn().mockImplementation(() => {
      return {
        playTrack: vi.fn(),
        stopTrack: vi.fn().mockImplementation((fadeOut, callback) => {
          if (callback) callback()
        }),
        setVolume: vi.fn(),
        updateVolume: vi.fn(),
        toggleMusic: vi.fn(),
        dispose: vi.fn(),
      }
    }),
  }
})

describe('MenuScene', () => {
  let menuScene: MenuScene

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a game state
    const gameState = new GameState()
    window.GAME_STATE = gameState

    menuScene = new MenuScene()

    // Initialize audio manually since we're not calling init()
    menuScene['audio'] = {
      playNote: vi.fn(),
      playSequence: vi.fn(),
      toggleMute: vi.fn().mockReturnValue(false),
      isMuted: vi.fn().mockReturnValue(false),
      dispose: vi.fn(),
    }

    // Initialize music manually
    menuScene['music'] = {
      playTrack: vi.fn(),
      stopTrack: vi.fn().mockImplementation((fadeOut, callback) => {
        if (callback) callback()
      }),
      setVolume: vi.fn(),
      updateVolume: vi.fn(),
      toggleMusic: vi.fn(),
      dispose: vi.fn(),
    }

    // Initialize game state
    menuScene['gameState'] = gameState
  })

  describe('constructor', () => {
    it('should set the scene key to "menu"', () => {
      expect(menuScene.scene.key).toBe('menu')
    })
  })

  describe('create', () => {
    it('should create UI elements', () => {
      menuScene.create()

      // Check if text elements were created
      expect(menuScene.add.text).toHaveBeenCalledTimes(5) // Title + 3 buttons + version info

      // Check if the title was created
      expect(menuScene.add.text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'SIGNAL LOST',
        expect.any(Object)
      )

      // Check if the Start Game button was created
      expect(menuScene.add.text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Start Game',
        expect.any(Object)
      )

      // Check if keyboard events were set up
      expect(menuScene.input.keyboard?.on).toHaveBeenCalled()
    })

    it('should set up scene transitions', () => {
      menuScene.create()

      // Get the Start Game button mock
      const startButtonMock = menuScene.add.text.mock.results[1].value

      // Simulate clicking the Start Game button
      const clickHandler = startButtonMock.on.mock.calls.find(call => call[0] === 'pointerdown')[1]

      clickHandler()

      // Check if music was stopped
      expect(menuScene['music'].stopTrack).toHaveBeenCalled()

      // Check if the scene transition was triggered
      expect(menuScene.scene.start).toHaveBeenCalledWith('game', {
        levelId: 'start',
        gameState: menuScene['gameState'],
      })
    })
  })
})
