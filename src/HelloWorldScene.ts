import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io')

    this.load.image('sky', 'assets/skies/space3.png')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
    this.load.image('red', 'assets/particles/red.png')
  }

  create() {
    this.add.image(400, 300, 'sky')

    // Create particles
    const particles = this.add.particles(400, 300, 'red')

    // Create emitter
    const emitter = particles.createEmitter()

    // Configure emitter
    emitter.setSpeed(100)
    emitter.setScale({ start: 1, end: 0 })
    emitter.setBlendMode(Phaser.BlendModes.ADD)

    // Add logo
    const logo = this.physics.add.image(400, 100, 'logo')

    // Configure logo
    logo.setVelocity(100, 200)
    logo.setBounce(1, 1)
    logo.setCollideWorldBounds(true)

    // Make particles follow the logo
    emitter.startFollow(logo)
  }
}
