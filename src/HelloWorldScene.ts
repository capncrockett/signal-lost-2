import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io')

    this.load.image('sky', 'assets/skies/space3.png')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
  }

  create() {
    this.add.image(400, 300, 'sky')

    // Add logo
    const logo = this.physics.add.image(400, 100, 'logo')

    // Configure logo
    logo.setVelocity(100, 200)
    logo.setBounce(1, 1)
    logo.setCollideWorldBounds(true)
  }
}
