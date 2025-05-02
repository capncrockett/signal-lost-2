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
  O: 'pressure_plate', // Pressure plate (looks like a circle)
  M: 'timed_door', // Timed door (M for "momentary")
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
    'Push the Block',
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

  // Basic Puzzles - Simple introductions to each mechanic

  puzzle1: parseAsciiMap(
    'puzzle1',
    'Block Puzzle',
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

  // Advanced Puzzles - More complex challenges with each mechanic

  blocks1: parseAsciiMap(
    'blocks1',
    'Block Challenge',
    `
    #############
    #.....#.....#
    #..B..#..X..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..B..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..B..#..X..#
    #.....#.....#
    #############
    `
  ),

  blocks2: parseAsciiMap(
    'blocks2',
    'Multiple Targets',
    `
    #############
    #.....#.....#
    #..B..#..X..#
    #.....#.....#
    #..B..#..X..#
    #.....#.....#
    #..P..#.....#
    #.....#.....#
    #..B..#..X..#
    #.....#.....#
    #.....#.....#
    #.....#.....#
    #############
    `
  ),

  switches1: parseAsciiMap(
    'switches1',
    'Switch Sequence',
    `
    #############
    #.....#.....#
    #..S..#..D..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..S..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..S..#.....#
    #.....#.....#
    #############
    `
  ),

  switches2: parseAsciiMap(
    'switches2',
    'Switch and Block',
    `
    #############
    #.....#.....#
    #..S..#..D..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..B..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #.....#..X..#
    #.....#.....#
    #############
    `
  ),

  keys1: parseAsciiMap(
    'keys1',
    'Key Collection',
    `
    #############
    #.....#.....#
    #..K..#.....#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..L..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..K..#.....#
    #.....#.....#
    #############
    `
  ),

  keys2: parseAsciiMap(
    'keys2',
    'Keys and Blocks',
    `
    #############
    #.....#.....#
    #..K..#..B..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..L..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #.....#..X..#
    #.....#.....#
    #############
    `
  ),

  teleport1: parseAsciiMap(
    'teleport1',
    'Teleport Maze',
    `
    #############
    #.....#.....#
    #..T..#.....#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..T..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..T..#.....#
    #.....#.....#
    #############
    `
  ),

  // New puzzle types - Pressure plates and timed doors

  pressure1: parseAsciiMap(
    'pressure1',
    'Pressure Plate Basics',
    `
    ###########
    #.........#
    #...O.....#
    #....P....#
    #.........#
    #.....M...#
    ###########
    `
  ),

  pressure2: parseAsciiMap(
    'pressure2',
    'Block on Plate',
    `
    ###########
    #.........#
    #...B.....#
    #....P....#
    #.........#
    #.....O...#
    #.....M...#
    ###########
    `
  ),

  timed1: parseAsciiMap(
    'timed1',
    'Timed Run',
    `
    #############
    #.....#.....#
    #..O..#.....#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..M..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #.....#..X..#
    #.....#.....#
    #############
    `
  ),

  combined1: parseAsciiMap(
    'combined1',
    'Combined Puzzle Challenge',
    `
    #############
    #.....#.....#
    #..O..#..B..#
    #.....#.....#
    #.#####..M..#
    #.....#.....#
    #..P..#..X..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..K..#..L..#
    #.....#.....#
    #############
    `
  ),

  teleport2: parseAsciiMap(
    'teleport2',
    'Teleport and Block',
    `
    #############
    #.....#.....#
    #..T..#..X..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..P..#..B..#
    #.....#.....#
    #.#####.....#
    #.....#.....#
    #..T..#.....#
    #.....#.....#
    #############
    `
  ),

  // Expert Puzzles - Complex combinations of multiple mechanics

  expert1: parseAsciiMap(
    'expert1',
    'Expert Challenge 1',
    `
    ###############
    #.....#.......#
    #..K..#...B...#
    #.....#.......#
    #.#####...X...#
    #.....#.......#
    #..P..#...L...#
    #.....#.......#
    #.#####...T...#
    #.....#.......#
    #..S..#...D...#
    #.....#.......#
    ###############
    `
  ),

  expert2: parseAsciiMap(
    'expert2',
    'Expert Challenge 2',
    `
    ###############
    #.....#.......#
    #..T..#...S...#
    #.....#.......#
    #..B..#...D...#
    #.....#.......#
    #..P..#...K...#
    #.....#.......#
    #..X..#...L...#
    #.....#.......#
    #..T..#...B...#
    #.....#.......#
    ###############
    `
  ),

  expert3: parseAsciiMap(
    'expert3',
    'Expert Challenge 3',
    `
    #################
    #.......#.......#
    #...B...#...X...#
    #.......#.......#
    #...K...#...L...#
    #.......#.......#
    #...S...#...D...#
    #.......#.......#
    #####.#####.#####
    #.......#.......#
    #...T...#...T...#
    #.......#.......#
    #...P...#...B...#
    #.......#.......#
    #...S...#...D...#
    #.......#.......#
    #################
    `
  ),
}
