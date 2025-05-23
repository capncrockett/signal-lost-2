/**
 * Audio module using Tone.js for chiptune-style music and sound effects
 */

import * as Tone from 'tone'

export interface AudioConfig {
  muted?: boolean
}

export class AudioManager {
  private synth: Tone.PolySynth
  private effects: {
    reverb: Tone.Reverb
    delay: Tone.FeedbackDelay
  }
  private muted: boolean

  constructor(config: AudioConfig = {}) {
    try {
      // Initialize Tone.js
      Tone.start()

      // Create synth
      this.synth = new Tone.PolySynth(Tone.Synth).toDestination()

      // Create effects
      this.effects = {
        reverb: new Tone.Reverb(1.5).toDestination(),
        delay: new Tone.FeedbackDelay(0.3, 0.5).toDestination(),
      }
    } catch (error) {
      console.warn('Audio initialization failed, likely running in CI environment:', error)
      // Create dummy objects for CI environment
      this.synth = {} as Tone.PolySynth<Tone.Synth>
      this.effects = {
        reverb: {} as Tone.Reverb,
        delay: {} as Tone.FeedbackDelay,
      }
    }

    // Set initial mute state
    this.muted = config.muted || false
    this.setMute(this.muted)
  }

  /**
   * Play a single note
   */
  playNote(note: string, duration = '8n', time = Tone.now()): void {
    if (this.muted) return
    try {
      this.synth.triggerAttackRelease(note, duration, time)
    } catch (error) {
      console.warn('Audio playback failed, likely running in CI environment:', error)
    }
  }

  /**
   * Play a sequence of notes
   */
  playSequence(notes: string[], durations: string[] = [], interval = '8n'): void {
    if (this.muted) return

    try {
      // Play each note in sequence with a delay
      notes.forEach((note, index) => {
        const time = Tone.now() + index * Tone.Time(interval).toSeconds()
        const duration = durations[index] || interval
        this.synth.triggerAttackRelease(note, duration, time)
      })

      // Start the transport to ensure notes play
      Tone.Transport.start()
    } catch (error) {
      console.warn('Audio sequence playback failed, likely running in CI environment:', error)
    }

    // No need to clean up since we're not using a Sequence object anymore
  }

  /**
   * Play a predefined sound effect
   */
  playSoundEffect(
    effect: 'pickup' | 'success' | 'error' | 'move' | 'interact' | 'teleport' | 'unlock' | 'levelComplete'
  ): void {
    if (this.muted) return

    try {
      switch (effect) {
        case 'pickup':
          this.synth.connect(this.effects.reverb)
          this.playNote('C5', '16n')
          this.playNote('E5', '16n', Tone.now() + 0.1)
          this.playNote('G5', '8n', Tone.now() + 0.2)
          setTimeout(() => {
            try {
              this.synth.disconnect(this.effects.reverb)
            } catch (error) {
              // Ignore disconnect errors in CI
            }
          }, 500)
          break

        case 'success':
          this.synth.connect(this.effects.reverb)
          this.playSequence(['C4', 'E4', 'G4', 'C5'], ['8n', '8n', '8n', '4n'], '8n')
          setTimeout(() => {
            try {
              this.synth.disconnect(this.effects.reverb)
            } catch (error) {
              // Ignore disconnect errors in CI
            }
          }, 1000)
          break

        case 'error':
          this.playNote('C3', '8n')
          this.playNote('B2', '8n', Tone.now() + 0.2)
          break

        case 'move':
          this.playNote('C4', '32n')
          break

        case 'interact':
          this.playNote('E4', '16n')
          this.playNote('G4', '16n', Tone.now() + 0.1)
          break

        case 'teleport':
          this.synth.connect(this.effects.delay)
          this.playNote('G5', '16n')
          this.playNote('C6', '16n', Tone.now() + 0.1)
          this.playNote('G5', '16n', Tone.now() + 0.2)
          setTimeout(() => {
            try {
              this.synth.disconnect(this.effects.delay)
            } catch (error) {
              // Ignore disconnect errors in CI
            }
          }, 500)
          break

        case 'unlock':
          this.playNote('A4', '16n')
          this.playNote('C5', '16n', Tone.now() + 0.1)
          this.playNote('E5', '16n', Tone.now() + 0.2)
          break

        case 'levelComplete':
          this.synth.connect(this.effects.reverb)
          this.playSequence(['C4', 'E4', 'G4', 'C5', 'E5', 'G5'], ['8n', '8n', '8n', '8n', '8n', '4n'], '8n')
          setTimeout(() => {
            try {
              this.synth.disconnect(this.effects.reverb)
            } catch (error) {
              // Ignore disconnect errors in CI
            }
          }, 2000)
          break
      }
    } catch (error) {
      console.warn('Sound effect playback failed, likely running in CI environment:', error)
    }
  }

  /**
   * Toggle mute state
   */
  toggleMute(): boolean {
    this.muted = !this.muted
    this.setMute(this.muted)
    return this.muted
  }

  /**
   * Set mute state
   */
  setMute(muted: boolean): void {
    this.muted = muted
    try {
      Tone.Destination.mute = this.muted
    } catch (error) {
      console.warn('Audio mute failed, likely running in CI environment:', error)
    }
  }

  /**
   * Get current mute state
   */
  isMuted(): boolean {
    return this.muted
  }

  /**
   * Dispose of all audio resources
   */
  dispose(): void {
    try {
      this.synth.dispose()
      this.effects.reverb.dispose()
      this.effects.delay.dispose()
      Tone.Transport.stop()
    } catch (error) {
      console.warn('Audio disposal failed, likely running in CI environment:', error)
    }
  }
}
