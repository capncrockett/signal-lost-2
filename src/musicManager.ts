/**
 * Music manager for background music using Tone.js
 * Handles procedurally generated music for different game scenes
 */

import * as Tone from 'tone'
import { GameState } from './state'

export interface MusicConfig {
  gameState: GameState
}

export interface TrackDefinition {
  key: string
  notes: string[][]
  durations: string[][]
  bpm: number
  instruments: {
    type: 'synth' | 'am' | 'fm' | 'membrane'
    options?: any
  }[]
  effects?: {
    type: 'reverb' | 'delay' | 'distortion' | 'chorus'
    options?: any
  }[]
}

export class MusicManager {
  private gameState: GameState
  private currentTrack: string = ''
  private isPlaying: boolean = false
  private instruments: Tone.Instrument[] = []
  private effects: Tone.Effect[] = []
  private sequences: Tone.Sequence[] = []
  private tracks: Record<string, TrackDefinition> = {}
  private fadeInterval: number | null = null
  private currentVolume: number = 0

  constructor(config: MusicConfig) {
    this.gameState = config.gameState
    this.currentVolume = this.gameState.audio.musicVolume

    // Define tracks for different scenes
    this.defineTracks()

    // Try to initialize Tone.js
    try {
      Tone.start()
      Tone.Transport.bpm.value = 120
    } catch (error) {
      console.warn('Music initialization failed, likely running in CI environment:', error)
    }
  }

  /**
   * Define music tracks for different scenes
   */
  private defineTracks(): void {
    // Menu music - calm, ambient
    this.tracks.menu = {
      key: 'menu',
      bpm: 80,
      notes: [
        ['C3', 'E3', 'G3', 'B3', 'C4', 'E4', 'G4', 'B4'],
        ['A2', 'C3', 'E3', 'G3', 'A3', 'C4', 'E4', 'G4'],
      ],
      durations: [
        ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n'],
        ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n'],
      ],
      instruments: [
        { type: 'synth', options: { oscillator: { type: 'sine' } } },
        { type: 'fm', options: { harmonicity: 3.01 } }
      ],
      effects: [
        { type: 'reverb', options: { decay: 5 } },
        { type: 'chorus', options: { frequency: 0.5, depth: 0.7 } }
      ]
    }

    // Game music - more upbeat, adventurous
    this.tracks.game = {
      key: 'game',
      bpm: 100,
      notes: [
        ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', 'G3'],
        ['G2', 'D3', 'G3', 'B3', 'D3', 'G3', 'B3', 'D4'],
      ],
      durations: [
        ['8n', '8n', '8n', '8n', '8n', '8n', '8n', '8n'],
        ['2n', '4n', '4n', '2n', '4n', '4n', '2n', '4n'],
      ],
      instruments: [
        { type: 'synth', options: { oscillator: { type: 'triangle' } } },
        { type: 'am', options: { harmonicity: 1.5 } }
      ],
      effects: [
        { type: 'delay', options: { delayTime: 0.25, feedback: 0.2 } }
      ]
    }

    // Level complete music - triumphant
    this.tracks.success = {
      key: 'success',
      bpm: 120,
      notes: [
        ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'],
        ['C3', 'G3', 'C4', 'E4', 'G4', 'C5', 'G4'],
      ],
      durations: [
        ['8n', '8n', '8n', '8n', '8n', '8n', '2n'],
        ['4n', '4n', '4n', '4n', '4n', '4n', '2n'],
      ],
      instruments: [
        { type: 'synth', options: { oscillator: { type: 'square' } } },
        { type: 'synth', options: { oscillator: { type: 'triangle' } } }
      ],
      effects: [
        { type: 'reverb', options: { decay: 2 } }
      ]
    }

    // Settings music - calm, ambient
    this.tracks.settings = {
      key: 'settings',
      bpm: 70,
      notes: [
        ['E3', 'G3', 'B3', 'D4', 'E4', 'G4', 'B4', 'D5'],
        ['A2', 'E3', 'A3', 'C4', 'E4', 'A4', 'C5', 'E5'],
      ],
      durations: [
        ['4n', '4n', '4n', '4n', '4n', '4n', '4n', '4n'],
        ['2n', '2n', '2n', '2n', '2n', '2n', '2n', '2n'],
      ],
      instruments: [
        { type: 'synth', options: { oscillator: { type: 'sine' } } },
        { type: 'fm', options: { harmonicity: 2.5 } }
      ],
      effects: [
        { type: 'reverb', options: { decay: 4 } },
        { type: 'chorus', options: { frequency: 0.3, depth: 0.5 } }
      ]
    }
  }

  /**
   * Play a specific music track
   */
  playTrack(trackKey: string): void {
    // Don't restart the same track
    if (this.currentTrack === trackKey && this.isPlaying) {
      return
    }

    // Check if music is enabled
    if (!this.gameState.audio.musicEnabled) {
      return
    }

    // Stop current track with fade out
    if (this.isPlaying) {
      this.stopTrack(true, () => {
        this.startTrack(trackKey)
      })
    } else {
      this.startTrack(trackKey)
    }
  }

  /**
   * Start playing a track
   */
  private startTrack(trackKey: string): void {
    try {
      // Get track definition
      const track = this.tracks[trackKey]
      if (!track) {
        console.warn(`Track "${trackKey}" not found`)
        return
      }

      // Clean up any existing instruments and sequences
      this.cleanupResources()

      // Set BPM
      Tone.Transport.bpm.value = track.bpm

      // Create instruments
      track.instruments.forEach(instrumentDef => {
        let instrument: Tone.Instrument

        switch (instrumentDef.type) {
          case 'synth':
            instrument = new Tone.Synth(instrumentDef.options)
            break
          case 'am':
            instrument = new Tone.AMSynth(instrumentDef.options)
            break
          case 'fm':
            instrument = new Tone.FMSynth(instrumentDef.options)
            break
          case 'membrane':
            instrument = new Tone.MembraneSynth(instrumentDef.options)
            break
          default:
            instrument = new Tone.Synth(instrumentDef.options)
        }

        // Set volume based on game state
        instrument.volume.value = Tone.gainToDb(this.gameState.audio.musicVolume)
        this.instruments.push(instrument)
      })

      // Create effects
      if (track.effects) {
        track.effects.forEach(effectDef => {
          let effect: Tone.Effect

          switch (effectDef.type) {
            case 'reverb':
              effect = new Tone.Reverb(effectDef.options)
              break
            case 'delay':
              effect = new Tone.FeedbackDelay(effectDef.options)
              break
            case 'distortion':
              effect = new Tone.Distortion(effectDef.options)
              break
            case 'chorus':
              effect = new Tone.Chorus(effectDef.options)
              break
            default:
              effect = new Tone.Reverb(effectDef.options)
          }

          this.effects.push(effect)
        })
      }

      // Connect instruments to effects and destination
      this.instruments.forEach((instrument, index) => {
        if (this.effects.length > 0) {
          // Connect instrument to first effect
          instrument.connect(this.effects[0])

          // Connect effects in chain
          for (let i = 0; i < this.effects.length - 1; i++) {
            this.effects[i].connect(this.effects[i + 1])
          }

          // Connect last effect to destination
          this.effects[this.effects.length - 1].connect(Tone.Destination)
        } else {
          // No effects, connect directly to destination
          instrument.connect(Tone.Destination)
        }

        // Create sequence for this instrument
        if (track.notes[index] && track.durations[index]) {
          const sequence = new Tone.Sequence(
            (time, note) => {
              instrument.triggerAttackRelease(
                note,
                track.durations[index][sequence.index % track.durations[index].length],
                time
              )
            },
            track.notes[index],
            '4n'
          )

          sequence.loop = true
          sequence.start(0)
          this.sequences.push(sequence)
        }
      })

      // Start transport
      Tone.Transport.start()

      // Update state
      this.currentTrack = trackKey
      this.isPlaying = true
      this.gameState.audio.currentTrack = trackKey

      // Fade in
      this.fadeIn()
    } catch (error) {
      console.warn('Failed to start music track, likely running in CI environment:', error)
    }
  }

  /**
   * Stop the current track
   */
  stopTrack(fadeOut: boolean = true, callback?: () => void): void {
    if (!this.isPlaying) {
      if (callback) callback()
      return
    }

    if (fadeOut) {
      this.fadeOut(() => {
        this.cleanupResources()
        this.isPlaying = false
        this.currentTrack = ''
        this.gameState.audio.currentTrack = ''
        if (callback) callback()
      })
    } else {
      this.cleanupResources()
      this.isPlaying = false
      this.currentTrack = ''
      this.gameState.audio.currentTrack = ''
      if (callback) callback()
    }
  }

  /**
   * Clean up resources
   */
  private cleanupResources(): void {
    try {
      // Stop and dispose sequences
      this.sequences.forEach(sequence => {
        sequence.stop()
        sequence.dispose()
      })
      this.sequences = []

      // Dispose instruments
      this.instruments.forEach(instrument => {
        instrument.dispose()
      })
      this.instruments = []

      // Dispose effects
      this.effects.forEach(effect => {
        effect.dispose()
      })
      this.effects = []

      // Clear any fade intervals
      if (this.fadeInterval !== null) {
        clearInterval(this.fadeInterval)
        this.fadeInterval = null
      }
    } catch (error) {
      console.warn('Failed to clean up music resources, likely running in CI environment:', error)
    }
  }

  /**
   * Fade in the music
   */
  private fadeIn(duration: number = 1000): void {
    try {
      // Clear any existing fade interval
      if (this.fadeInterval !== null) {
        clearInterval(this.fadeInterval)
      }

      // Start from zero volume
      this.setVolume(0)
      this.currentVolume = 0

      // Calculate step size
      const targetVolume = this.gameState.audio.musicVolume
      const steps = 20
      const stepSize = targetVolume / steps
      const stepTime = duration / steps

      // Create fade interval
      this.fadeInterval = setInterval(() => {
        this.currentVolume += stepSize
        if (this.currentVolume >= targetVolume) {
          this.currentVolume = targetVolume
          this.setVolume(this.currentVolume)
          clearInterval(this.fadeInterval as number)
          this.fadeInterval = null
        } else {
          this.setVolume(this.currentVolume)
        }
      }, stepTime) as unknown as number
    } catch (error) {
      console.warn('Failed to fade in music, likely running in CI environment:', error)
    }
  }

  /**
   * Fade out the music
   */
  private fadeOut(callback?: () => void, duration: number = 1000): void {
    try {
      // Clear any existing fade interval
      if (this.fadeInterval !== null) {
        clearInterval(this.fadeInterval)
      }

      // Start from current volume
      this.currentVolume = this.gameState.audio.musicVolume

      // Calculate step size
      const steps = 20
      const stepSize = this.currentVolume / steps
      const stepTime = duration / steps

      // Create fade interval
      this.fadeInterval = setInterval(() => {
        this.currentVolume -= stepSize
        if (this.currentVolume <= 0) {
          this.currentVolume = 0
          this.setVolume(0)
          clearInterval(this.fadeInterval as number)
          this.fadeInterval = null
          if (callback) callback()
        } else {
          this.setVolume(this.currentVolume)
        }
      }, stepTime) as unknown as number
    } catch (error) {
      console.warn('Failed to fade out music, likely running in CI environment:', error)
      if (callback) callback()
    }
  }

  /**
   * Set the volume for all instruments
   */
  setVolume(volume: number): void {
    try {
      // Ensure volume is between 0 and 1
      volume = Math.max(0, Math.min(1, volume))

      // Convert to dB
      const dbVolume = Tone.gainToDb(volume)

      // Set volume for all instruments
      this.instruments.forEach(instrument => {
        instrument.volume.value = dbVolume
      })
    } catch (error) {
      console.warn('Failed to set music volume, likely running in CI environment:', error)
    }
  }

  /**
   * Update volume based on game state
   */
  updateVolume(): void {
    if (this.gameState.audio.musicEnabled) {
      this.setVolume(this.gameState.audio.musicVolume)
      this.currentVolume = this.gameState.audio.musicVolume
    } else {
      this.setVolume(0)
      this.currentVolume = 0
    }
  }

  /**
   * Toggle music on/off
   */
  toggleMusic(): boolean {
    const enabled = this.gameState.toggleMusic()
    if (enabled) {
      // If turning on and no track is playing, play the last track
      if (!this.isPlaying && this.gameState.audio.currentTrack) {
        this.playTrack(this.gameState.audio.currentTrack)
      } else {
        this.fadeIn()
      }
    } else {
      // If turning off, fade out
      this.fadeOut()
    }
    return enabled
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {
    this.stopTrack(false)
    this.cleanupResources()
  }
}
