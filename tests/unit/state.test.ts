import { describe, it, expect } from 'vitest'
import { GameState } from '../../src/state'

describe('GameState', () => {
  it('should initialize with default values', () => {
    const state = new GameState()
    
    expect(state.player.x).toBe(0)
    expect(state.player.y).toBe(0)
    expect(state.player.health).toBe(100)
    expect(state.player.inventory).toEqual([])
    
    expect(state.level.id).toBe('start')
    expect(state.level.solved).toBe(false)
    expect(state.level.entities).toEqual({})
    
    expect(state.progress.levelsCompleted).toBe(0)
    expect(state.progress.puzzlesSolved).toBe(0)
    
    expect(state.debug.showOverlay).toBe(true)
    expect(state.debug.godMode).toBe(false)
  })
  
  it('should update player position', () => {
    const state = new GameState()
    state.updatePlayerPosition(10, 20)
    
    expect(state.player.x).toBe(10)
    expect(state.player.y).toBe(20)
  })
  
  it('should add items to inventory without duplicates', () => {
    const state = new GameState()
    state.addToInventory('key')
    state.addToInventory('potion')
    state.addToInventory('key') // Duplicate
    
    expect(state.player.inventory).toEqual(['key', 'potion'])
    expect(state.player.inventory.length).toBe(2)
  })
  
  it('should mark level as solved and update progress', () => {
    const state = new GameState()
    state.solveLevel()
    
    expect(state.level.solved).toBe(true)
    expect(state.progress.levelsCompleted).toBe(1)
    expect(state.progress.puzzlesSolved).toBe(1)
  })
  
  it('should load a new level', () => {
    const state = new GameState()
    state.level.solved = true
    state.level.entities = { 'test': { id: 'test' } }
    
    state.loadLevel('level2')
    
    expect(state.level.id).toBe('level2')
    expect(state.level.solved).toBe(false)
    expect(state.level.entities).toEqual({})
  })
  
  it('should register and update entities', () => {
    const state = new GameState()
    state.registerEntity('player_1', { type: 'player', x: 5, y: 5 })
    
    expect(state.level.entities['player_1']).toEqual({ type: 'player', x: 5, y: 5 })
    
    state.updateEntity('player_1', { x: 10 })
    
    expect(state.level.entities['player_1']).toEqual({ type: 'player', x: 10, y: 5 })
  })
})
