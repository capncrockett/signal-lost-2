# Signal Lost: Puzzle Mechanics Guide

This guide explains the various puzzle mechanics in Signal Lost, how they work, and strategies for solving them.

## Table of Contents

1. [Basic Controls](#basic-controls)
2. [Puzzle Types](#puzzle-types)
   - [Block Puzzles](#block-puzzles)
   - [Switch Puzzles](#switch-puzzles)
   - [Key Puzzles](#key-puzzles)
   - [Teleporter Puzzles](#teleporter-puzzles)
   - [Pressure Plate Puzzles](#pressure-plate-puzzles)
3. [Combined Puzzles](#combined-puzzles)
4. [Tips and Strategies](#tips-and-strategies)
5. [Creating Custom Levels](#creating-custom-levels)

## Basic Controls

Before diving into puzzle mechanics, it's important to understand the basic controls:

- **Arrow Keys**: Move the player character
- **E**: Interact with puzzle elements (keys, switches, teleporters)
- **Space**: Alternative interaction key
- **R**: Restart the current level (if enabled)
- **D**: Toggle debug overlay (for development)

## Puzzle Types

Signal Lost features several types of puzzles, each with unique mechanics and challenges.

### Block Puzzles

![Block Puzzle](assets/block-puzzle.png)

**Elements:**
- **Blocks (B)**: Movable objects that can be pushed
- **Targets (X)**: Marked positions where blocks need to be placed

**How it works:**
1. Push blocks by moving into them
2. Blocks can only move if there's an empty space behind them
3. Blocks cannot be pulled, only pushed
4. When all targets have blocks on them, the puzzle is solved

**Example Level:**
```
###########
#.........#
#...B.....#
#....P....#
#.........#
#.....X...#
###########
```

**Strategy Tips:**
- Plan your moves carefully - blocks can get stuck against walls
- Try to avoid pushing blocks into corners unless they're on a target
- Sometimes you need to push blocks in a specific sequence

### Switch Puzzles

![Switch Puzzle](assets/switch-puzzle.png)

**Elements:**
- **Switches (S)**: Interactive elements that can be activated
- **Doors (D)**: Barriers that open when switches are activated

**How it works:**
1. Press 'E' or Space while standing next to a switch to activate it
2. When a switch is activated, all doors in the level open
3. When all switches are activated, the puzzle is solved

**Example Level:**
```
###########
#.........#
#...S.....#
#....P....#
#.........#
#.....D...#
###########
```

**Strategy Tips:**
- Switches can be activated by the player or by pushing blocks onto them
- Once a switch is activated, it stays activated for the duration of the level
- Plan your route through the level, as doors might block your path initially

### Key Puzzles

![Key Puzzle](assets/key-puzzle.png)

**Elements:**
- **Keys (K)**: Collectible items that can be used to unlock doors
- **Locked Doors (L)**: Barriers that require a key to open

**How it works:**
1. Walk over a key to collect it (automatically added to inventory)
2. Press 'E' or Space while standing next to a locked door to use a key
3. Each key can only be used once
4. When all locked doors are opened, the puzzle is solved

**Example Level:**
```
###########
#.........#
#...K.....#
#....P....#
#.........#
#.....L...#
###########
```

**Strategy Tips:**
- Keys are consumed in the order they were collected
- You can see your current inventory in the debug overlay (press 'D')
- Some levels may have more locked doors than keys, requiring you to choose which doors to unlock

### Teleporter Puzzles

![Teleporter Puzzle](assets/teleporter-puzzle.png)

**Elements:**
- **Teleporters (T)**: Devices that transport the player to another teleporter

**How it works:**
1. Step onto a teleporter to be transported to another teleporter in the level
2. If there are multiple teleporters, you'll be sent to the next one in sequence
3. Teleporters can be used to reach otherwise inaccessible areas

**Example Level:**
```
###########
#.........#
#...T.....#
#....P....#
#.........#
#.....T...#
###########
```

**Strategy Tips:**
- Teleporters work in both directions
- You can use teleporters to quickly move across the level
- Sometimes you need to use teleporters multiple times to reach your goal

### Pressure Plate Puzzles

![Pressure Plate Puzzle](assets/pressure-plate-puzzle.png)

**Elements:**
- **Pressure Plates (O)**: Floor plates that activate when stepped on
- **Timed Doors (M)**: Doors that open temporarily when pressure plates are activated

**How it works:**
1. Step on a pressure plate to activate it
2. When activated, all timed doors in the level open
3. Timed doors close automatically after a few seconds
4. If all pressure plates are activated simultaneously, the puzzle is solved

**Example Level:**
```
###########
#.........#
#...O.....#
#....P....#
#.........#
#.....M...#
###########
```

**Strategy Tips:**
- Pressure plates remain activated only while something is on them (player or block)
- You can place blocks on pressure plates to keep them activated
- Timing is crucial - you may need to quickly move through timed doors before they close

## Combined Puzzles

As you progress through the game, you'll encounter levels that combine multiple puzzle types, creating more complex challenges.

**Example Combined Level:**
```
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
```

In this level, you need to:
1. Collect the key to unlock the locked door
2. Use the teleporter to reach another area
3. Activate the switch to open the door
4. Push the block onto the target

**Strategy Tips for Combined Puzzles:**
- Break down the puzzle into smaller parts
- Identify the sequence in which you need to solve each element
- Look for dependencies between different puzzle types
- Sometimes you need to solve puzzles in a specific order

## Tips and Strategies

### General Tips

1. **Observe Before Acting**: Take time to study the level before making your first move
2. **Plan Ahead**: Think several moves ahead, especially with block puzzles
3. **Use the Debug Overlay**: Press 'D' to see your position, inventory, and level information
4. **Restart if Needed**: If you get stuck, don't hesitate to restart the level
5. **Look for Patterns**: Many puzzles follow common patterns that you'll recognize with experience

### Advanced Strategies

1. **Block Management**: In levels with multiple blocks, focus on moving them in the correct order
2. **Resource Conservation**: In key puzzles, make sure you're using keys on the right doors
3. **Timing Coordination**: For pressure plate puzzles, coordinate your movements to maximize time
4. **Teleporter Chains**: Sometimes you need to use teleporters in a specific sequence
5. **Combined Approaches**: In complex levels, identify which puzzle elements to solve first

## Creating Custom Levels

Signal Lost uses an ASCII-based mapping system for level design, making it easy to create your own levels.

### ASCII Map Legend

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

### Example Custom Level

```
###########
#....K....#
#.#######.#
#.#.....#.#
#.#..P..#.#
#.#.....#.#
#.#..B..#.#
#.L.....X.#
###########
```

This level requires the player to collect a key, unlock a door, and push a block onto a target.

### Level Design Tips

1. **Start Simple**: Begin with a clear puzzle concept
2. **Ensure Solvability**: Always test your levels to make sure they can be solved
3. **Progressive Difficulty**: Introduce mechanics gradually
4. **Visual Clarity**: Keep the layout clear and readable
5. **Purposeful Design**: Every element should serve a purpose

---

We hope this guide helps you understand and enjoy the puzzle mechanics in Signal Lost. Happy puzzle solving!
