import { describe, it, expect, beforeEach, vi } from 'vitest'
import SettingsScene from '../../src/scenes/SettingsScene'

// Mock Phaser
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class {
        scene = { key: 'settings' }
        constructor() { }
        add: any = {
          text: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
            setStyle: vi.fn().mockReturnThis(),
            setText: vi.fn().mockReturnThis(),
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
          key: 'settings',
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
      }
    }),
  }
})

// Mock GameState
vi.mock('../../src/state', () => {
  return {
    GameState: vi.fn().mockImplementation(() => {
      return {
        player: {
          moveSound: true,
        },
        debug: {
          showOverlay: false,
        },
      }
    }),
  }
})

// Mock window.GAME_STATE
global.window = {
  ...global.window,
  GAME_STATE: {
    player: {
      moveSound: true,
    },
    debug: {
      showOverlay: false,
    },
  },
}

describe('SettingsScene', () => {
  let settingsScene: SettingsScene

  beforeEach(() => {
    vi.clearAllMocks()
    settingsScene = new SettingsScene()
    // Initialize audio and gameState manually since we're not calling init()
    settingsScene['audio'] = {
      playNote: vi.fn(),
      playSequence: vi.fn(),
      toggleMute: vi.fn().mockReturnValue(false),
      isMuted: vi.fn().mockReturnValue(false),
    }
    settingsScene['gameState'] = global.window.GAME_STATE
  })

  describe('constructor', () => {
    it('should set the scene key to "settings"', () => {
      expect(settingsScene.scene.key).toBe('settings')
    })
  })

  describe('create', () => {
    it('should create UI elements', () => {
      settingsScene.create()

      // Check if text elements were created
      expect(settingsScene.add.text).toHaveBeenCalledTimes(5) // Title + 4 buttons

      // Check if the title was created
      expect(settingsScene.add.text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'SETTINGS',
        expect.any(Object)
      )

      // Check if keyboard events were set up
      expect(settingsScene.input.keyboard?.on).toHaveBeenCalled()
    })

    it.skip('should set up scene transitions', () => {
      settingsScene.create()

      // Mock the scene.start method
      settingsScene.scene.start.mockClear()

      // Get the Back button mock
      const backButtonMock = settingsScene.add.text.mock.results[4].value

      // Simulate clicking the Back button
      const clickHandler = backButtonMock.on.mock.calls.find(call => call[0] === 'pointerdown')[1]

      // Call the handler manually
      clickHandler()

      // Check if the scene transition was triggered
      expect(settingsScene.scene.start).toHaveBeenCalledWith('menu')
    })
  })
})
