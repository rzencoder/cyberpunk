import Phaser from "phaser";

export default class Flame extends Phaser.Sprite {
  constructor(game, x, y, image, duration) {
    super(game, x, y, image, duration);
    this.anchor.set(0.5);
    this.flameUp = true;
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.game.time.events.loop(duration, this.updateFlame, this);
    this.animations.add("play", [0, 1, 2, 3], 10, true);
    this.animations.play("play");
  }

  updateFlame() {
    if (this.flameUp) {
      this.position.y -= 33;
      this.flameUp = false;
    } else {
      this.position.y += 33;
      this.flameUp = true;
    }
  }
}
