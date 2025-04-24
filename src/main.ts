import Phaser from 'phaser'
import GameScene from './scenes/GameScene'
import { GameState } from './state'

// Create a global game state
const gameState = new GameState()

// Make game state available globally for debugging
declare global {
  interface Window {
    GAME_STATE: GameState
    getEntity: (id: string) => any
  }
}

// Expose debug hooks
window.GAME_STATE = gameState

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // No gravity for top-down game
      debug: false,
    },
  },
  scene: [GameScene],
}

const game = new Phaser.Game(config)

// Expose entity getter
window.getEntity = (id: string) => {
  const scene = game.scene.getScene('game') as GameScene
  return scene ? scene.getEntityById(id) : null
}

export default game
