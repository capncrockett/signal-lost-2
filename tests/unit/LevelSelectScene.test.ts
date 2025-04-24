import { describe, it, expect, beforeEach, vi } from 'vitest'
import LevelSelectScene from '../../src/scenes/LevelSelectScene'

// Mock Phaser
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class {
        scene = { key: 'levelSelect' }
        constructor() {}
        add: any = {
          rectangle: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
          }),
          text: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setInteractive: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
            setStyle: vi.fn().mockReturnThis(),
            setText: vi.fn().mockReturnThis(),
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
        }
        scene: any = {
          start: vi.fn(),
          key: 'levelSelect',
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

// Mock LEVELS
vi.mock('../../src/levels', () => {
  return {
    LEVELS: {
      start: { id: 'start', name: 'Starting Room', entities: {} },
      puzzle1: { id: 'puzzle1', name: 'First Puzzle', entities: {} },
    },
  }
})

describe('LevelSelectScene', () => {
  let levelSelectScene: LevelSelectScene

  beforeEach(() => {
    vi.clearAllMocks()
    levelSelectScene = new LevelSelectScene()
    // Initialize audio manually since we're not calling init()
    levelSelectScene['audio'] = {
      playNote: vi.fn(),
      playSequence: vi.fn(),
      toggleMute: vi.fn().mockReturnValue(false),
      isMuted: vi.fn().mockReturnValue(false),
    }
  })

  describe('constructor', () => {
    it('should set the scene key to "levelSelect"', () => {
      expect(levelSelectScene.scene.key).toBe('levelSelect')
    })
  })

  describe('create', () => {
    it('should create UI elements', () => {
      levelSelectScene.create()

      // Check if text elements were created
      expect(levelSelectScene.add.text).toHaveBeenCalledTimes(4) // Title + 2 level buttons + back button

      // Check if the title was created
      expect(levelSelectScene.add.text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'SELECT LEVEL',
        expect.any(Object)
      )

      // Check if keyboard events were set up
      expect(levelSelectScene.input.keyboard?.on).toHaveBeenCalled()
    })

    it.skip('should set up scene transitions', () => {
      levelSelectScene.create()

      // Mock the scene.start method
      levelSelectScene.scene.start.mockClear()

      // Get the Back button mock
      const backButtonMock = levelSelectScene.add.text.mock.results[3].value

      // Simulate clicking the Back button
      const clickHandler = backButtonMock.on.mock.calls.find(call => call[0] === 'pointerdown')[1]

      // Call the handler manually
      clickHandler()

      // Check if the scene transition was triggered
      expect(levelSelectScene.scene.start).toHaveBeenCalledWith('menu')
    })
  })
})
