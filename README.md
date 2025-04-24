# 🎮 Signal Lost: AI-Driven 16-Bit Puzzle Adventure

A retro-style, top-down exploration & puzzle game—entirely developed, tested, and maintained by AI agents.
Built in the browser with Phaser 3 + TypeScript + Vite. Fully modular, testable, and transparent.

## 🛠️ Tech Stack

| Layer          | Tool                        | Purpose                                          |
|----------------|-----------------------------|-------------------------------------------------|
| Engine         | Phaser 3 (v3.60+) + TypeScript | 2D rendering, input, tilemaps, scenes           |
| Bundler/Dev    | Vite                        | Fast dev server, ES modules, HMR                 |
| Unit Testing   | Vitest                      | Vite-native test runner with Jest-compatible API |
| E2E Testing    | Playwright                  | Browser automation for full-flow tests           |
| Linter/Format  | ESLint + Prettier           | Enforce code style & catch errors                |
| Audio          | Tone.js                     | Code-defined chiptune melodies & SFX             |
| CI/CD          | GitHub Actions              | Build → Test → Lint → Format → Merge gate        |

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
# 1. Dev server (hot-reload)
npm run dev

# 2. Build for production
npm run build

# 3. Run all checks:
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
   window.GAME_STATE = gameState;
   window.getEntity = (id) => scene.findByName(id);
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

This guide serves as a valuable reference to prevent over-engineering and help break out of development loops by providing practical, tested approaches to common game development challenges.

## ✅ Next Steps

- ✔️ Review & commit README.md, project-memory.json, .devcontainer.json (if using), and initial src/main.ts
- ✔️ Kick off Agent Alpha on the POC branch (map + movement)
- ✔️ Kick off Agent Beta to verify tests, linting, and docs
