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
}
