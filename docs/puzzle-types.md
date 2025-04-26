# Signal Lost Puzzle Types Documentation

## Overview

Signal Lost features several types of puzzle elements that players can interact with to solve levels. This document provides details on each puzzle type, their behavior, and how they interact with each other.

## Puzzle Types

### Blocks and Targets

Blocks are movable objects that players can push. The goal is typically to place blocks on target positions.

#### Behavior

- **Blocks**: Can be pushed by the player in any of the four cardinal directions.
- **Targets**: Static markers on the ground that indicate where blocks should be placed.
- **Completion**: A level with blocks and targets is solved when all targets have blocks placed on them.

#### Implementation

Blocks are implemented as entities with the type `'block'`. Targets are implemented as entities with the type `'target'`.

```typescript
// Register a block
gameState.registerEntity('block_3_3', {
  id: 'block_3_3',
  type: 'block',
  x: 3,
  y: 3,
  active: true
})

// Register a target
gameState.registerEntity('target_5_5', {
  id: 'target_5_5',
  type: 'target',
  x: 5,
  y: 5,
  active: true
})
```

### Switches and Doors

Switches can be activated to open doors, allowing access to new areas.

#### Behavior

- **Switches**: Can be activated by the player or by placing a block on them.
- **Doors**: Block passage until opened by activating switches.
- **Completion**: A level with switches is solved when all switches are activated.

#### Implementation

Switches are implemented as entities with the type `'switch'`. Doors are implemented as entities with the type `'door'`.

```typescript
// Register a switch
gameState.registerEntity('switch_2_2', {
  id: 'switch_2_2',
  type: 'switch',
  x: 2,
  y: 2,
  active: true,
  activated: false
})

// Register a door
gameState.registerEntity('door_4_4', {
  id: 'door_4_4',
  type: 'door',
  x: 4,
  y: 4,
  active: true
})
```

When a switch is activated, all doors in the level are opened (set to `active: false`).

### Keys and Locked Doors

Keys can be collected and used to unlock doors, allowing access to new areas.

#### Behavior

- **Keys**: Can be collected by the player and added to inventory.
- **Locked Doors**: Block passage until unlocked with a key from the player's inventory.
- **Completion**: A level with locked doors is solved when all locked doors are unlocked.

#### Implementation

Keys are implemented as entities with the type `'key'`. Locked doors are implemented as entities with the type `'locked_door'`.

```typescript
// Register a key
gameState.registerEntity('key_5_5', {
  id: 'key_5_5',
  type: 'key',
  x: 5,
  y: 5,
  active: true
})

// Register a locked door
gameState.registerEntity('locked_door_6_6', {
  id: 'locked_door_6_6',
  type: 'locked_door',
  x: 6,
  y: 6,
  active: true
})
```

When a player collects a key, it's added to their inventory and removed from the level. When a player interacts with a locked door, a key is consumed from their inventory and the door is unlocked.

### Teleporters

Teleporters allow the player to instantly move from one location to another.

#### Behavior

- **Teleporters**: Transport the player to another teleporter when stepped on.
- **Pairs**: Teleporters work in pairs; stepping on one teleports the player to the other.

#### Implementation

Teleporters are implemented as entities with the type `'teleporter'`.

```typescript
// Register a pair of teleporters
gameState.registerEntity('teleporter_7_7', {
  id: 'teleporter_7_7',
  type: 'teleporter',
  x: 7,
  y: 7,
  active: true
})

gameState.registerEntity('teleporter_8_8', {
  id: 'teleporter_8_8',
  type: 'teleporter',
  x: 8,
  y: 8,
  active: true
})
```

When a player steps on a teleporter, they are transported to the position of another active teleporter in the level.

## Puzzle Engine API

The puzzle engine provides methods to interact with puzzle elements:

### Block Interaction

- `isBlockAt(x, y)`: Checks if a block is at the given position
- `tryMoveBlock(blockId, dx, dy)`: Attempts to move a block in the specified direction
- `checkBlockPuzzleCompletion()`: Checks if all targets have blocks on them

### Switch and Door Interaction

- `isSwitchAt(x, y)`: Checks if a switch is at the given position
- `isDoorAt(x, y)`: Checks if a door is at the given position
- `activateSwitch(x, y)`: Activates a switch at the given position
- `checkSwitchPuzzleCompletion()`: Checks if all switches are activated

### Key and Locked Door Interaction

- `isKeyAt(x, y)`: Checks if a key is at the given position
- `isLockedDoorAt(x, y)`: Checks if a locked door is at the given position
- `collectKey(x, y)`: Collects a key at the given position
- `tryUnlockDoor(x, y)`: Attempts to unlock a door at the given position
- `checkKeyPuzzleCompletion()`: Checks if all locked doors are unlocked

### Teleporter Interaction

- `isTeleporterAt(x, y)`: Checks if a teleporter is at the given position
- `useTeleporter(x, y)`: Uses a teleporter at the given position

## Level Completion

A level can be completed by solving any of the puzzle types present in the level. The `checkLevelCompletion()` method checks all puzzle types and returns true if any of them are complete.

## Example Usage

Here's an example of how to use the puzzle engine to interact with puzzle elements:

```typescript
// Create a puzzle engine
const puzzleEngine = new PuzzleEngine({ gameState })

// Check if a block is at position (3, 3)
const isBlock = puzzleEngine.isBlockAt(3, 3)

// Try to move a block
puzzleEngine.tryMoveBlock('block_3_3', 1, 0) // Move right

// Activate a switch
puzzleEngine.activateSwitch(2, 2)

// Collect a key
puzzleEngine.collectKey(5, 5)

// Try to unlock a door
puzzleEngine.tryUnlockDoor(6, 6)

// Use a teleporter
const teleportResult = puzzleEngine.useTeleporter(7, 7)
if (teleportResult.success) {
  // Teleport the player
  player.setPosition(teleportResult.newX * 32 + 16, teleportResult.newY * 32 + 16)
}

// Check if the level is complete
const isComplete = puzzleEngine.checkLevelCompletion()
```

## Creating Custom Puzzle Levels

When creating custom levels with puzzle elements, follow these guidelines:

1. Register all puzzle entities with the game state
2. Ensure puzzle elements are properly positioned
3. Set up the appropriate completion conditions
4. Test the level to ensure it can be solved

For more complex puzzles, you can combine different puzzle types to create interesting challenges.
