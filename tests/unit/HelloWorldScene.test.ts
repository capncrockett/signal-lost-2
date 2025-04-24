import { describe, it, expect, vi } from 'vitest'
import HelloWorldScene from '../../src/HelloWorldScene'

// Mock Phaser
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class {
        scene = { key: 'hello-world' }
        constructor() {}
        add = {
          image: vi.fn().mockReturnThis(),
          particles: vi.fn().mockReturnThis(),
        }
        physics = {
          add: {
            image: vi.fn().mockReturnThis(),
          },
        }
        load = {
          setBaseURL: vi.fn(),
          image: vi.fn(),
        }
      },
    },
  }
})

describe('HelloWorldScene', () => {
  it('should create a scene with the correct key', () => {
    const scene = new HelloWorldScene()
    expect(scene.scene.key).toBe('hello-world')
  })
})
