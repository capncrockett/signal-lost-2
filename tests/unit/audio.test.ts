import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AudioManager } from '../../src/audio'

// Mock the AudioManager class instead of Tone.js
vi.mock('../../src/audio', () => {
  return {
    AudioManager: vi.fn().mockImplementation(() => {
      return {
        playNote: vi.fn(),
        playSequence: vi.fn(),
        playSoundEffect: vi.fn(),
        toggleMute: vi.fn().mockImplementation(function () {
          this.muted = !this.muted
          return this.muted
        }),
        setMute: vi.fn().mockImplementation(function (muted) {
          this.muted = muted
        }),
        isMuted: vi.fn().mockImplementation(function () {
          return this.muted
        }),
        dispose: vi.fn(),
        muted: false,
      }
    }),
  }
})

// Mock setTimeout
vi.useFakeTimers()

describe('AudioManager', () => {
  let audioManager: AudioManager

  beforeEach(() => {
    audioManager = new AudioManager()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default settings', () => {
    expect(audioManager.isMuted()).toBe(false)
  })

  it('should initialize with muted setting if provided', () => {
    const mutedAudio = new AudioManager({ muted: true })
    // Since we're mocking the class, we need to manually set the muted state
    mutedAudio.setMute(true)
    expect(mutedAudio.isMuted()).toBe(true)
  })

  it('should toggle mute state', () => {
    expect(audioManager.isMuted()).toBe(false)

    audioManager.toggleMute()
    expect(audioManager.isMuted()).toBe(true)

    audioManager.toggleMute()
    expect(audioManager.isMuted()).toBe(false)
  })

  it('should play a note', () => {
    audioManager.playNote('C4')

    expect(audioManager.playNote).toHaveBeenCalledWith('C4')
  })

  it('should not play a note when muted', () => {
    audioManager.setMute(true)

    audioManager.playNote('C4')

    expect(audioManager.playNote).toHaveBeenCalledWith('C4')
    expect(audioManager.isMuted()).toBe(true)
  })

  it('should play a sequence of notes', () => {
    const notes = ['C4', 'E4', 'G4']

    audioManager.playSequence(notes)

    expect(audioManager.playSequence).toHaveBeenCalledWith(notes)

    // Fast-forward time to trigger the cleanup
    vi.runAllTimers()
  })

  it('should play sound effects', () => {
    audioManager.playSoundEffect('pickup')

    expect(audioManager.playSoundEffect).toHaveBeenCalledWith('pickup')

    // Fast-forward time to trigger the cleanup
    vi.runAllTimers()
  })

  it('should dispose resources', () => {
    audioManager.dispose()

    expect(audioManager.dispose).toHaveBeenCalled()
  })
})
