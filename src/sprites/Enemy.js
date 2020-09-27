import Phaser from "phaser";

export default class Enemy extends Phaser.Sprite {
  constructor(game, x, y, image, gravity, velocity) {
    super(game, x, y, image);
    console.log(velocity);
    this.anchor.set(0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.allowGravity = gravity;
    this.body.velocity.x = velocity;
    this.startVelocity = velocity;
    // animations
    if (image === "drone") {
      this.animations.add("move", [0], 8, true);
      this.animations.add("die", [1, 2, 3, 4, 5, 6], 10);
      this.animations.play("move");
    } else {
      this.animations.add("move", [0, 1, 2, 3, 4, 5], 8, true);
      this.animations.add("die", [6, 7, 8, 9, 10, 11], 10);
      this.animations.play("move");
    }
  }

  update() {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
      this.body.velocity.x = this.startVelocity * -1; // turn left
      this.scale.x = -1;
    } else if (this.body.touching.left || this.body.blocked.left) {
      this.body.velocity.x = Math.abs(this.startVelocity); // turn right
      this.scale.x = 1;
    }
  }

  die() {
    this.body.enable = false;
    this.animations.play("die").onComplete.addOnce(() => this.kill());
  }
}
