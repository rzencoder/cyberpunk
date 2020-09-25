import Phaser from "phaser";

export default class Spike extends Phaser.Sprite {
  constructor(game, x, y, image, duration) {
    super(game, x, y, image, duration);
    this.anchor.set(0.5);
    this.spikeUp = true;
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.game.time.events.loop(duration, this.updateSpike, this);
    this.animations.add("play", [0, 1, 2, 3], 10, true);
    this.animations.play("play");
  }

  updateSpike() {
    if (this.spikeUp) {
      this.position.y -= 33;
      this.spikeUp = false;
    } else {
      this.position.y += 33;
      this.spikeUp = true;
    }
  }
}
