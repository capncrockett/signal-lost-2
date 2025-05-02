/**
 * Mock implementation of MusicManager for testing
 */
export class MusicManagerMock {
  private currentTrack: string = ''
  private isPlaying: boolean = false
  private volume: number = 0.7

  playTrack(trackKey: string): void {
    this.currentTrack = trackKey
    this.isPlaying = true
  }

  stopTrack(fadeOut: boolean = true, callback?: () => void): void {
    this.currentTrack = ''
    this.isPlaying = false
    if (callback) callback()
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  updateVolume(): void {
    // Do nothing in mock
  }

  toggleMusic(): boolean {
    this.isPlaying = !this.isPlaying
    return this.isPlaying
  }

  dispose(): void {
    this.currentTrack = ''
    this.isPlaying = false
  }
}
