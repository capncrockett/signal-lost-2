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
    // Initialize Tone.js
    Tone.start()

    // Create synth
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination()

    // Create effects
    this.effects = {
      reverb: new Tone.Reverb(1.5).toDestination(),
      delay: new Tone.FeedbackDelay(0.3, 0.5).toDestination(),
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
    this.synth.triggerAttackRelease(note, duration, time)
  }

  /**
   * Play a sequence of notes
   */
  playSequence(notes: string[], durations: string[] = [], interval = '8n'): void {
    if (this.muted) return

    // Play each note in sequence with a delay
    notes.forEach((note, index) => {
      const time = Tone.now() + index * Tone.Time(interval).toSeconds()
      const duration = durations[index] || interval
      this.synth.triggerAttackRelease(note, duration, time)
    })

    // Start the transport to ensure notes play
    Tone.Transport.start()

    // No need to clean up since we're not using a Sequence object anymore
  }

  /**
   * Play a predefined sound effect
   */
  playSoundEffect(effect: 'pickup' | 'success' | 'error' | 'move'): void {
    if (this.muted) return

    switch (effect) {
      case 'pickup':
        this.synth.connect(this.effects.reverb)
        this.playNote('C5', '16n')
        this.playNote('E5', '16n', Tone.now() + 0.1)
        this.playNote('G5', '8n', Tone.now() + 0.2)
        setTimeout(() => this.synth.disconnect(this.effects.reverb), 500)
        break

      case 'success':
        this.synth.connect(this.effects.reverb)
        this.playSequence(['C4', 'E4', 'G4', 'C5'], ['8n', '8n', '8n', '4n'], '8n')
        setTimeout(() => this.synth.disconnect(this.effects.reverb), 1000)
        break

      case 'error':
        this.playNote('C3', '8n')
        this.playNote('B2', '8n', Tone.now() + 0.2)
        break

      case 'move':
        this.playNote('C4', '32n')
        break
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
    Tone.Destination.mute = this.muted
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
    this.synth.dispose()
    this.effects.reverb.dispose()
    this.effects.delay.dispose()
    Tone.Transport.stop()
  }
}
