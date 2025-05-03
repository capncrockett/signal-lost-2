# Signal Lost Project Orientation

## Project Overview
Signal Lost is a retro-style 16-bit browser-based puzzle game built with Phaser 3, TypeScript, and Vite. The game features procedurally generated puzzles, levels, and music, and is currently in the Proof of Concept (POC) phase.

## Technical Stack
- **Engine**: Phaser 3 with TypeScript
- **Build System**: Vite
- **Testing**: Vitest (unit tests) and Playwright (E2E tests)
- **Audio**: Tone.js for procedural audio generation
- **CI/CD**: GitHub Actions

## Development Approach

### ASCII Mapping System (CRITICAL)
The game uses an ASCII-based mapping system for level design:
- Levels are defined in `src/levels.ts` using ASCII characters
- Each character represents a game element:
  - `#`: Wall
  - `.`: Floor
  - `P`: Player starting position
  - `B`: Block (can be pushed)
  - `X`: Target (for blocks)
  - `S`: Switch
  - `D`: Door
  - `K`: Key
  - `L`: Locked door
  - `T`: Teleporter
  - `O`: Pressure plate
  - `M`: Timed door
  - ` ` (space): Empty

Example ASCII map:
```
###########
#.........#
#...B.....#
#....P....#
#.........#
#.....X...#
###########
```

### Debug Tools (CRITICAL)
The game provides several debugging tools that are essential for development:

1. **Debug Overlay**:
   - Toggle with the "D" key in-game
   - Shows player position, inventory, level info, and game progress
   - Essential for understanding the game state during development

2. **Debug Panel**:
   - HTML interface with buttons for common debug actions
   - Toggle overlay, god mode, and level switching

3. **Global Debug API**:
   - `window.GAME_STATE`: Access to the entire game state
   - `window.getEntity(id)`: Get entity by ID
   - Use these to programmatically interact with the game

Example of using the debug API:
```javascript
// Move player to position
window.GAME_STATE.player.x = 100;
window.GAME_STATE.player.y = 100;

// Add item to inventory
window.GAME_STATE.addToInventory('key_1_1');

// Check level status
console.log(window.GAME_STATE.level.solved);

// Create a custom entity
window.GAME_STATE.registerEntity('block_3_3', {
  id: 'block_3_3',
  type: 'block',
  x: 3,
  y: 3,
  active: true
});
```

## Puzzle Types
The game includes several puzzle types:
1. **Block Puzzles**: Push blocks onto targets
2. **Switch Puzzles**: Activate switches to open doors
3. **Key Puzzles**: Collect keys to unlock doors
4. **Teleporter Puzzles**: Use teleporters to move around
5. **Pressure Plate Puzzles**: Step on plates to open timed doors

## Workflow and Process

### Git Workflow
- Always branch from `develop`, never from `main`
- Feature branches should follow pattern: `feature/alpha/*` or `feature/beta/*`
- Never push directly to `develop` or `main`
- Create PRs using GitHub CLI
- Wait for CI checks to pass before merging

### Agent Roles
- **Agent Alpha**: Feature development and unit tests
- **Agent Beta**: QA, linting, documentation, and E2E tests

### Development Commands
```bash
# Start development server
npm run dev

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Check TypeScript compilation
npm run build:check

# Lint code
npm run lint

# Format check
npm run format:check
```

## How to Approach Tasks

### For Feature Development
1. Start the dev server with `npm run dev`
2. Use the debug overlay (D key) to visualize game state
3. Modify or create levels using the ASCII mapping system
4. Test changes using the debug API
5. Write unit tests for new functionality
6. Create E2E tests for user interactions

### For Bug Fixing
1. Reproduce the issue using the debug tools
2. Inspect the game state using `window.GAME_STATE`
3. Use the debug overlay to visualize the problem
4. Fix the issue and verify with tests

### For Level Design
1. Use the ASCII mapping system in `src/levels.ts`
2. Follow existing level patterns
3. Test levels using the level selection screen
4. Ensure puzzles are solvable

## Current Priorities
1. Improving debugging tools and error handling
2. Creating documentation for puzzle mechanics
3. Developing additional levels showcasing puzzle types
4. Enhancing visual feedback for puzzle interactions
5. Implementing save game functionality

Remember: The game is currently in POC phase. Focus on core functionality and avoid over-engineering. Always use the ASCII mapping system and debug tools when working on the game.
