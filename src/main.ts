import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'

// Create a global game state object that can be accessed for debugging
declare global {
  interface Window {
    GAME_STATE: any;
    getEntity: (id: string) => any;
  }
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	title: 'Signal Lost',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }, // No gravity for top-down game
			debug: false
		},
	},
	scene: [HelloWorldScene],
}

const game = new Phaser.Game(config);

// Initialize empty game state for debugging
window.GAME_STATE = {};
window.getEntity = (id: string) => null; // Will be implemented later

export default game;
