# Signal Lost: Code Documentation Standards

This document defines the code documentation standards for the Signal Lost project. Following these standards ensures that the codebase is maintainable, accessible to new contributors, and consistently documented.

## Table of Contents

1. [General Principles](#general-principles)
2. [File Headers](#file-headers)
3. [Class Documentation](#class-documentation)
4. [Method/Function Documentation](#methodfunction-documentation)
5. [Interface/Type Documentation](#interfacetype-documentation)
6. [Variable Documentation](#variable-documentation)
7. [Code Examples](#code-examples)
8. [JSDoc Tags Reference](#jsdoc-tags-reference)
9. [Automated Checks](#automated-checks)

## General Principles

- **Be concise but comprehensive**: Provide enough information to understand the code without unnecessary details
- **Focus on why, not just what**: Explain the purpose and reasoning, not just the implementation
- **Keep documentation close to code**: Document directly above the relevant code
- **Update documentation when code changes**: Outdated documentation is worse than no documentation
- **Use proper English**: Write in complete sentences with correct grammar and punctuation

## File Headers

Every file should begin with a header comment that describes its purpose and contents:

```typescript
/**
 * ASCII map generator and loader
 * Converts ASCII maps to game objects
 */
```

For more complex files, include additional information:

```typescript
/**
 * Puzzle logic for block pushing, switches, doors, keys, pressure plates, timed doors, etc.
 * 
 * This module handles all puzzle-related interactions in the game, including:
 * - Block movement and target detection
 * - Switch activation and door control
 * - Key collection and locked door mechanics
 * - Teleporter functionality
 * - Pressure plate and timed door systems
 */
```

## Class Documentation

Document classes with a description of their purpose, responsibilities, and usage:

```typescript
/**
 * PuzzleEngine handles all puzzle-related interactions in the game.
 * It manages block movement, switch activation, key collection, and other puzzle mechanics.
 * 
 * @example
 * const puzzleEngine = new PuzzleEngine({ gameState, audio });
 * puzzleEngine.tryMoveBlock('block_1_1', 1, 0);
 */
export class PuzzleEngine {
  // Class implementation
}
```

## Method/Function Documentation

Document methods and functions with a description, parameters, return value, and examples if needed:

```typescript
/**
 * Tries to move a block in the specified direction.
 * 
 * @param blockId - The ID of the block to move
 * @param dx - The x-direction to move (1 = right, -1 = left)
 * @param dy - The y-direction to move (1 = down, -1 = up)
 * @returns True if the block was moved successfully, false otherwise
 * 
 * @example
 * // Move block to the right
 * puzzleEngine.tryMoveBlock('block_1_1', 1, 0);
 */
tryMoveBlock(blockId: string, dx: number, dy: number): boolean {
  // Method implementation
}
```

## Interface/Type Documentation

Document interfaces and types with a description and information about each property:

```typescript
/**
 * Configuration options for the PuzzleEngine.
 */
export interface PuzzleConfig {
  /**
   * The game state instance to use for puzzle operations.
   */
  gameState: GameState;
  
  /**
   * Optional audio manager for playing sound effects.
   */
  audio?: AudioManager;
}
```

## Variable Documentation

Document important variables, especially constants and configuration objects:

```typescript
/**
 * Mapping from ASCII characters to tile types.
 * Used for converting ASCII maps to game objects.
 */
const TILE_MAPPING = {
  '#': 'wall',
  '.': 'floor',
  'P': 'player',
  // Additional mappings...
};
```

## Code Examples

Include examples in documentation when they help clarify usage:

```typescript
/**
 * Parses an ASCII map into a level data object.
 * 
 * @example
 * const levelData = parseAsciiMap(
 *   'level1',
 *   'First Level',
 *   `
 *   ###########
 *   #.........#
 *   #...B.....#
 *   #....P....#
 *   #.........#
 *   #.....X...#
 *   ###########
 *   `
 * );
 */
export function parseAsciiMap(id: string, name: string, asciiMap: string): LevelData {
  // Function implementation
}
```

## JSDoc Tags Reference

Use these JSDoc tags consistently throughout the codebase:

- `@param` - Documents a function parameter
- `@returns` - Documents the return value of a function
- `@example` - Provides an example of how to use the code
- `@deprecated` - Marks code as deprecated with migration instructions
- `@see` - References related documentation or code
- `@todo` - Indicates planned work (use sparingly and with specific details)
- `@private` - Indicates that a member is private (TypeScript's `private` keyword is preferred)
- `@readonly` - Indicates that a property is read-only (TypeScript's `readonly` keyword is preferred)

## Automated Checks

The project uses ESLint with the `eslint-plugin-jsdoc` plugin to enforce documentation standards. The following checks are enabled:

- Requiring JSDoc comments for exported functions, classes, and interfaces
- Validating JSDoc syntax and structure
- Ensuring parameter documentation matches function signatures
- Checking for missing return type documentation

To run documentation checks:

```bash
npm run lint
```

## Documentation Templates

### Class Template

```typescript
/**
 * [Class description]
 * 
 * [Additional details about the class]
 * 
 * @example
 * [Usage example]
 */
```

### Method Template

```typescript
/**
 * [Method description]
 * 
 * @param [paramName] - [Parameter description]
 * @returns [Return value description]
 * 
 * @example
 * [Usage example]
 */
```

### Interface Template

```typescript
/**
 * [Interface description]
 */
export interface InterfaceName {
  /**
   * [Property description]
   */
  propertyName: PropertyType;
}
```

---

By following these documentation standards, we ensure that the Signal Lost codebase remains maintainable, accessible, and well-documented for all contributors.
