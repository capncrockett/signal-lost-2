# 🎮 Signal Lost: AI-Driven 16-Bit Puzzle Adventure

A retro-style, top-down exploration & puzzle game—entirely developed, tested, and maintained by AI agents.
Built in the browser with Phaser 3 + TypeScript + Vite. Fully modular, testable, and transparent.

## 🛠️ Tech Stack

| Layer         | Tool                           | Purpose                                          |
| ------------- | ------------------------------ | ------------------------------------------------ |
| Engine        | Phaser 3 (v3.60+) + TypeScript | 2D rendering, input, tilemaps, scenes            |
| Bundler/Dev   | Vite                           | Fast dev server, ES modules, HMR                 |
| Unit Testing  | Vitest                         | Vite-native test runner with Jest-compatible API |
| E2E Testing   | Playwright                     | Browser automation for full-flow tests           |
| Linter/Format | ESLint + Prettier              | Enforce code style & catch errors                |
| Audio         | Tone.js                        | Code-defined chiptune melodies & SFX             |
| CI/CD         | GitHub Actions                 | Build → Test → Lint → Format → Merge gate        |

## 📁 Project Structure

```
Signal-Lost/
├─ .github/               # GitHub Actions workflows
├─ assets/                # Pixel art sprites & audio sequences
├─ src/
│   ├─ main.ts            # Phaser game bootstrap & scene manager
│   ├─ levels.ts          # ASCII-map generator & loader
│   ├─ player.ts          # Player actor, input & collision
│   ├─ puzzleEngine.ts    # Puzzle logic (block push, switches)
│   ├─ state.ts           # Central gameState (exposed on window)
│   └─ debugOverlay.ts    # Renders gameState for AI hooks
├─ tests/
│   ├─ unit/              # Vitest tests for modules
│   └─ e2e/               # Playwright scripts
├─ tsconfig.json          # TypeScript config
├─ package.json           # Scripts & dependencies
├─ .eslintrc.js           # ESLint rules
├─ .prettierrc            # Prettier config
├─ game.html              # HTML entry point + debug API
├─ README.md              # Project README
└─ project-memory.json    # Agent seed file & guardrails
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Dev server (hot-reload)
npm run dev

# 3. Build for production
npm run build

# 4. Run all checks:
# Compile & type-check
npm run build:check

# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Lint & format
npm run lint
npm run format:check
```

## 🎮 How to Play

1. Start the development server with `npm run dev`
2. Open your browser to `http://localhost:8000`
3. Use the arrow keys to move the player character
4. Push blocks onto targets to solve puzzles

### Controls:

- **Arrow Keys**: Move the player
- **E**: Interact with puzzle elements (keys, doors, switches, teleporters)
- **M**: Toggle audio mute/unmute
- **S**: Toggle movement sounds
- **D**: Toggle debug overlay

### Debug Panel:

The game includes a debug panel that shows:

- Player position and inventory
- Current level information
- Game progress

This panel can be toggled with the "D" key and provides useful information for development and testing.

## 🤖 Dual-Agent Workflow

- **Agent Alpha**: Feature Development & Unit Tests
- **Agent Beta**: QA/Maintainer, Lint, E2E Tests, Documentation

### PR Gates:

1. `npm run build:check`
2. `npm run test:unit`
3. `npm run test:e2e`
4. `npm run lint`
5. `npm run format:check`

All checks must pass before merging into main.

## 🧠 project-memory.json (Agent Seed)

The [project-memory.json](./project-memory.json) file serves as the central configuration for AI agents working on this project. It defines:

- **Project Goals**: The high-level objectives for the game
- **Current Phase**: Development stage (POC, MVP, etc.)
- **Coding Rules**: Architecture and implementation guidelines
- **Agent Roles**: Responsibilities for Alpha and Beta agents
- **Must/Don't Rules**: Required practices and constraints

This file is used by both agents to maintain consistency and follow project guidelines.

## 🔄 Integrating the Template & Updates

1. Use a battle-tested Phaser 3 + TS + Vite starter:
   https://github.com/dstrph/phaser3-typescript-vite-starter

2. Swap Jest for Vitest:

   - Faster, native Vite integration
   - Jest-compatible API, minimal config

3. Add Playwright Config pointing at the Vite dev server (http://localhost:3000)

4. Enable ESLint + Prettier via community configs

5. Expose Debug Hooks in src/main.ts:

   ```typescript
   window.GAME_STATE = gameState
   window.getEntity = id => scene.findByName(id)
   ```

6. Follow the Phases (POC → MVP → Phase 1):
   - Movement & debug overlay first
   - Then puzzles
   - Then audio

## 📚 Development Resources

### Game Development Reference Guide

The [game-development-reference-guide.md](./game-development-reference-guide.md) contains comprehensive research on Phaser 3 + TypeScript game development, including:

- Analysis of successful open-source Phaser 3 projects
- Common development challenges and solutions
- Best practices for performance optimization
- Tips for implementing retro pixel art aesthetics
- Audio management strategies
- Input handling across different devices
- Scene and state management patterns
- TypeScript integration benefits

### Menu System Documentation

The [menu-system.md](./docs/menu-system.md) provides detailed documentation on the game's menu system, including:

- Menu scene structure and navigation flow
- UI components and keyboard navigation
- Audio feedback implementation
- Best practices for menu design
- Troubleshooting common issues

This guide serves as a valuable reference to prevent over-engineering and help break out of development loops by providing practical, tested approaches to common game development challenges.

## ✅ Current Progress

- ✔️ Basic game structure and architecture
- ✔️ Player movement and collision
- ✔️ Level loading from ASCII maps
- ✔️ Debug overlay for development
- ✔️ Simple puzzle mechanics (blocks and targets)
- ✔️ Advanced puzzle mechanics (switches, doors, keys, teleporters)
- ✔️ Audio system with Tone.js
- ✔️ Menu system with main menu, level select, and settings screens
- ✔️ Unit tests for all core modules
- ✔️ E2E tests for basic functionality
- ✔️ TypeScript error fixes for better CI compatibility

## 🔮 Next Steps

- Fix E2E tests to work with the new codebase structure
- Create additional levels with increasing difficulty
- Improve graphics with custom sprites
- Add story elements and objectives
- Implement a level editor
- Add save/load functionality
- Add more puzzle types (pressure plates, moving platforms)

See [TODO.md](./TODO.md) for a detailed list of current issues and next steps.
