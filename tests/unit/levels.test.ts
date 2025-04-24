import { describe, it, expect } from 'vitest'
import { parseAsciiMap, getLevel, LEVELS } from '../../src/levels'

describe('Levels', () => {
  describe('parseAsciiMap', () => {
    it('should parse ASCII map into level data', () => {
      const asciiMap = `
      ###
      #P#
      ###
      `
      
      const result = parseAsciiMap('test', 'Test Level', asciiMap)
      
      expect(result.id).toBe('test')
      expect(result.name).toBe('Test Level')
      expect(result.map.length).toBe(3)
      expect(result.map[0]).toBe('###')
      expect(result.map[1]).toBe('#P#')
      expect(result.map[2]).toBe('###')
      
      // Should find the player entity
      const playerEntity = Object.values(result.entities).find(e => e.type === 'player')
      expect(playerEntity).toBeDefined()
      expect(playerEntity?.x).toBe(1)
      expect(playerEntity?.y).toBe(1)
    })
    
    it('should handle complex maps with multiple entities', () => {
      const asciiMap = `
      #####
      #P..#
      #.B.#
      #..X#
      #####
      `
      
      const result = parseAsciiMap('complex', 'Complex Level', asciiMap)
      
      // Check map dimensions
      expect(result.map.length).toBe(5)
      expect(result.map[0].length).toBe(5)
      
      // Check entities
      const entities = Object.values(result.entities)
      expect(entities.length).toBe(3) // Player, Block, Target
      
      const player = entities.find(e => e.type === 'player')
      const block = entities.find(e => e.type === 'block')
      const target = entities.find(e => e.type === 'target')
      
      expect(player).toBeDefined()
      expect(block).toBeDefined()
      expect(target).toBeDefined()
      
      expect(player?.x).toBe(1)
      expect(player?.y).toBe(1)
      
      expect(block?.x).toBe(2)
      expect(block?.y).toBe(2)
      
      expect(target?.x).toBe(3)
      expect(target?.y).toBe(3)
    })
  })
  
  describe('getLevel', () => {
    it('should return the requested level if it exists', () => {
      const level = getLevel('start')
      expect(level).toBe(LEVELS.start)
      expect(level.id).toBe('start')
    })
    
    it('should return the start level if requested level does not exist', () => {
      const level = getLevel('nonexistent')
      expect(level).toBe(LEVELS.start)
    })
  })
  
  describe('LEVELS', () => {
    it('should have predefined levels', () => {
      expect(LEVELS.start).toBeDefined()
      expect(LEVELS.puzzle1).toBeDefined()
    })
  })
})
