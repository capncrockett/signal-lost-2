/**
 * ASCII map generator and loader
 * Converts ASCII maps to game objects
 */

export interface LevelData {
  id: string
  name: string
  map: string[]
  entities: Record<string, any>
}

// Tile mapping from ASCII to game objects
const TILE_MAPPING = {
  '#': 'wall',
  '.': 'floor',
  P: 'player',
  B: 'block',
  X: 'target',
  D: 'door',
  K: 'key',
  S: 'switch',
  T: 'teleporter',
  L: 'locked_door',
  ' ': null, // empty space
}

/**
 * Parse an ASCII map into a level data object
 */
export function parseAsciiMap(id: string, name: string, asciiMap: string): LevelData {
  const rows = asciiMap.trim().split('\n')
  const map = rows.map(row => row.trim())
  const entities: Record<string, any> = {}

  // Find entities in the map
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const char = map[y][x]
      const type = TILE_MAPPING[char as keyof typeof TILE_MAPPING]

      if (type && type !== 'wall' && type !== 'floor') {
        const entityId = `${type}_${x}_${y}`
        entities[entityId] = {
          id: entityId,
          type,
          x,
          y,
          active: true,
        }
      }
    }
  }

  return {
    id,
    name,
    map,
    entities,
  }
}

/**
 * Get a level by ID
 */
export function getLevel(id: string): LevelData {
  return LEVELS[id] || LEVELS.start
}

/**
 * Sample levels
 */
export const LEVELS: Record<string, LevelData> = {
  start: parseAsciiMap(
    'start',
    'Starting Room',
    `
    ###########
    #.........#
    #.........#
    #....P....#
    #.........#
    #.........#
    ###########
    `
  ),

  puzzle1: parseAsciiMap(
    'puzzle1',
    'First Puzzle',
    `
    ###########
    #.........#
    #...B.....#
    #....P....#
    #.........#
    #.....X...#
    ###########
    `
  ),

  puzzle2: parseAsciiMap(
    'puzzle2',
    'Switch Puzzle',
    `
    ###########
    #.........#
    #...S.....#
    #....P....#
    #.........#
    #.....D...#
    ###########
    `
  ),

  puzzle3: parseAsciiMap(
    'puzzle3',
    'Key and Lock Puzzle',
    `
    ###########
    #.........#
    #...K.....#
    #....P....#
    #.........#
    #.....L...#
    ###########
    `
  ),

  puzzle4: parseAsciiMap(
    'puzzle4',
    'Teleporter Puzzle',
    `
    ###########
    #.........#
    #...T.....#
    #....P....#
    #.........#
    #.....T...#
    ###########
    `
  ),

  puzzle5: parseAsciiMap(
    'puzzle5',
    'Combined Puzzle',
    `
    #############
    #.....#.....#
    #..K..#..T..#
    #.....L.....#
    #.....#.....#
    #..P..#..X..#
    #.....#.....#
    #..B..#..S..#
    #.....#.....#
    #.....D.....#
    #.....#.....#
    #############
    `
  ),
}
