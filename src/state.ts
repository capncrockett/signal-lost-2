/**
 * Central game state management
 * Stores the current state of the game and provides methods to update it
 */
export class GameState {
  // Player state
  player = {
    x: 0,
    y: 0,
    health: 100,
    inventory: [] as string[],
    moveSound: true,
  }

  // Level state
  level = {
    id: 'start',
    entities: {} as Record<string, any>,
    solved: false,
  }

  // Game progress
  progress = {
    levelsCompleted: 0,
    puzzlesSolved: 0,
  }

  // Audio settings
  audio = {
    musicEnabled: true,
    musicVolume: 0.7,
    sfxEnabled: true,
    sfxVolume: 1.0,
    currentTrack: '',
  }

  // Debug info
  debug = {
    showOverlay: true,
    godMode: false,
  }

  /**
   * Update player position
   */
  updatePlayerPosition(x: number, y: number): void {
    this.player.x = x
    this.player.y = y
  }

  /**
   * Add item to player inventory
   */
  addToInventory(item: string): void {
    if (!this.player.inventory.includes(item)) {
      this.player.inventory.push(item)
    }
  }

  /**
   * Mark current level as solved
   */
  solveLevel(): void {
    this.level.solved = true
    this.progress.levelsCompleted++
    this.progress.puzzlesSolved++
  }

  /**
   * Reset state for a new level
   */
  loadLevel(id: string): void {
    this.level.id = id
    this.level.solved = false
    this.level.entities = {}
  }

  /**
   * Register an entity in the current level
   */
  registerEntity(id: string, data: any): void {
    this.level.entities[id] = data
  }

  /**
   * Update entity data
   */
  updateEntity(id: string, data: Partial<any>): void {
    if (this.level.entities[id]) {
      this.level.entities[id] = {
        ...this.level.entities[id],
        ...data,
      }
    }
  }

  /**
   * Update music settings
   */
  updateMusicSettings(settings: Partial<typeof this.audio>): void {
    this.audio = {
      ...this.audio,
      ...settings,
    }
  }

  /**
   * Toggle music enabled state
   */
  toggleMusic(): boolean {
    this.audio.musicEnabled = !this.audio.musicEnabled
    return this.audio.musicEnabled
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    // Ensure volume is between 0 and 1
    this.audio.musicVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Toggle sound effects enabled state
   */
  toggleSfx(): boolean {
    this.audio.sfxEnabled = !this.audio.sfxEnabled
    return this.audio.sfxEnabled
  }

  /**
   * Set sound effects volume
   */
  setSfxVolume(volume: number): void {
    // Ensure volume is between 0 and 1
    this.audio.sfxVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Save current state to localStorage
   */
  saveToLocalStorage(): void {
    try {
      // Only save necessary state (not the entire level data)
      const savedState = {
        audio: this.audio,
        progress: this.progress,
        debug: this.debug,
      }
      localStorage.setItem('signalLostGameState', JSON.stringify(savedState))
    } catch (error) {
      console.warn('Failed to save game state to localStorage:', error)
    }
  }

  /**
   * Load state from localStorage
   */
  loadFromLocalStorage(): boolean {
    try {
      const savedState = localStorage.getItem('signalLostGameState')
      if (savedState) {
        const parsedState = JSON.parse(savedState)

        // Only restore specific parts of the state
        if (parsedState.audio) this.audio = parsedState.audio
        if (parsedState.progress) this.progress = parsedState.progress
        if (parsedState.debug) this.debug = parsedState.debug

        return true
      }
    } catch (error) {
      console.warn('Failed to load game state from localStorage:', error)
    }
    return false
  }
}
