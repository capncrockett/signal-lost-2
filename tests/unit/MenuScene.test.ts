import { describe, it, expect, beforeEach, vi } from 'vitest'
import MenuScene from '../../src/scenes/MenuScene'

// Mock Phaser
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class {
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

describe('MenuScene', () => {
  let menuScene: MenuScene

  beforeEach(() => {
    menuScene = new MenuScene()
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
      expect(menuScene.add.text).toHaveBeenCalledTimes(4) // Title + 3 buttons
      
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
      expect(menuScene.input.keyboard.on).toHaveBeenCalled()
    })

    it('should set up scene transitions', () => {
      menuScene.create()
      
      // Get the Start Game button mock
      const startButtonMock = menuScene.add.text.mock.results[1].value
      
      // Simulate clicking the Start Game button
      const clickHandler = startButtonMock.on.mock.calls.find(
        call => call[0] === 'pointerdown'
      )[1]
      
      clickHandler()
      
      // Check if the scene transition was triggered
      expect(menuScene.scene.start).toHaveBeenCalledWith('game', { levelId: 'start' })
    })
  })
})
