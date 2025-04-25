# Signal Lost Menu System Documentation

## Overview

The Signal Lost game features a comprehensive menu system that allows players to navigate between different parts of the game. The menu system consists of several scenes:

1. **Main Menu** (`MenuScene`): The entry point to the game
2. **Level Select** (`LevelSelectScene`): Allows players to choose which level to play
3. **Settings** (`SettingsScene`): Provides options to customize the game experience
4. **Game** (`GameScene`): The main gameplay scene

## Scene Structure

Each menu scene is implemented as a Phaser Scene class and follows a similar structure:

```typescript
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' }) // Scene key used for navigation
  }

  init(): void {
    // Initialize scene components
  }

  create(): void {
    // Create UI elements and set up event handlers
  }

  // Additional helper methods
}
```

## Navigation Flow

The menu system allows navigation between scenes as follows:

```
                  ┌─────────────┐
                  │  Main Menu  │
                  └─────────────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
            ▼           ▼           ▼
┌─────────────────┐ ┌─────────┐ ┌─────────┐
│  Level Select   │ │  Game   │ │ Settings│
└─────────────────┘ └─────────┘ └─────────┘
            │           ▲           │
            └───────────┼───────────┘
                        │
                  (Back to Menu)
```

## Scene Navigation

To navigate between scenes, use the `scene.start()` method with the appropriate scene key:

```typescript
// Navigate to the main menu
this.scene.start('menu')

// Navigate to the game scene with a specific level
this.scene.start('game', { levelId: 'level1' })

// Navigate to the level select screen
this.scene.start('levelSelect')

// Navigate to the settings screen
this.scene.start('settings')
```

## Main Menu

The main menu is the entry point to the game and provides options to:

- Start a new game
- Select a specific level
- Access game settings

### UI Components

- Title: "SIGNAL LOST"
- Start Game button
- Level Select button
- Settings button
- Version information

### Keyboard Navigation

The main menu supports keyboard navigation:

- **Up/Down Arrow Keys**: Navigate between menu options
- **Enter/Space**: Select the highlighted option
- **M**: Toggle audio mute/unmute

## Level Select

The level select screen allows players to choose which level to play.

### UI Components

- Title: "SELECT LEVEL"
- Buttons for each available level
- Back to Menu button

### Keyboard Navigation

- **Up/Down Arrow Keys**: Navigate between level options
- **Enter/Space**: Select the highlighted level
- **Escape**: Return to the main menu
- **M**: Toggle audio mute/unmute

## Settings

The settings screen allows players to customize their game experience.

### UI Components

- Title: "SETTINGS"
- Audio toggle button
- Movement Sounds toggle button
- Debug Overlay toggle button
- Back to Menu button

### Keyboard Navigation

- **Up/Down Arrow Keys**: Navigate between setting options
- **Enter/Space**: Toggle the highlighted setting
- **Escape**: Return to the main menu
- **M**: Toggle audio mute/unmute directly
- **S**: Toggle movement sounds directly
- **D**: Toggle debug overlay directly

## In-Game Menu Access

During gameplay, players can access the menu by clicking the "Menu" button in the top-right corner of the screen. This returns them to the main menu.

## Audio Feedback

The menu system provides audio feedback for user interactions:

- Button hover: No sound
- Button click: Note sound (varies by button)
- Menu navigation: Low note sound
- Menu entry: Sequence of notes

## Implementation Details

### Button Creation

Buttons are created using Phaser's text objects with interactive properties:

```typescript
const button = this.add
  .text(x, y, 'Button Text', buttonStyle)
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true })
  .on('pointerover', () => {
    button.setStyle(buttonHoverStyle)
  })
  .on('pointerout', () => {
    button.setStyle(buttonStyle)
  })
  .on('pointerdown', () => {
    this.audio.playNote('C4', '8n')
    this.scene.start('targetScene')
  })
```

### Keyboard Navigation Setup

Keyboard navigation is set up using Phaser's keyboard input system:

```typescript
private setupKeyboardNavigation(): void {
  if (!this.input.keyboard) return

  // Add keyboard navigation
  const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
  const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
  const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

  // Track selected button
  let selectedButton = 0
  const buttons = [this.startButton, this.levelSelectButton, this.settingsButton]

  // Highlight the first button by default
  buttons[selectedButton].setStyle(buttonHoverStyle)

  // Handle key presses
  upKey.on('down', () => {
    // Move selection up
  })

  downKey.on('down', () => {
    // Move selection down
  })

  enterKey.on('down', selectButton)
  spaceKey.on('down', selectButton)
}
```

## Best Practices

When working with the menu system, follow these best practices:

1. **Consistent Styling**: Use the same button styles across all menu scenes
2. **Audio Feedback**: Provide audio feedback for all user interactions
3. **Keyboard Navigation**: Ensure all menus can be navigated using the keyboard
4. **Responsive Design**: Position UI elements relative to the camera dimensions
5. **Error Handling**: Gracefully handle missing assets or initialization errors
6. **Scene Transitions**: Use consistent transitions between scenes

## Extending the Menu System

To add a new menu screen:

1. Create a new scene class extending `Phaser.Scene`
2. Implement the `init()` and `create()` methods
3. Add navigation buttons to connect to other scenes
4. Add the scene to the game config in `main.ts`

Example:

```typescript
// In your new scene file
export default class NewMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'newMenu' })
  }

  init(): void {
    // Initialize scene components
  }

  create(): void {
    // Create UI elements and set up event handlers
  }
}

// In main.ts
const config: Phaser.Types.Core.GameConfig = {
  // ...
  scene: [
    MenuScene,
    GameScene,
    LevelSelectScene,
    SettingsScene,
    NewMenuScene, // Add your new scene here
  ],
}
```

## Troubleshooting

### Common Issues

1. **Scene Not Found**: Ensure the scene key matches the one used in `scene.start()`
2. **UI Elements Not Visible**: Check z-index and alpha values
3. **Keyboard Navigation Not Working**: Ensure input keyboard is available and keys are properly registered
4. **Audio Not Playing**: Check if audio is muted or if the audio manager is properly initialized

### Debugging Tips

1. Use the debug overlay to check the current scene and game state
2. Add console logs to track scene transitions
3. Check for errors in the browser console
4. Use Phaser's built-in debug features to inspect scene objects
