import Phaser from "phaser";

export default class Blast extends Phaser.Sprite {
  constructor(game, x, y, distance, velocity, direction) {
    super(game, x, y, "blast");
    this.anchor.set(0.5);
    this.maxHeight = y;
    this.minHeight = y - distance;
    this.maxWidth = x;
    console.log(x);
    this.minWidth = x - distance;
    this.startVelocity = velocity;
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.body.collideWorldBounds = true;
    if (direction === "vertical") {
      this.body.velocity.y = velocity;
    } else if (direction === "horizontal") {
      this.body.velocity.x = velocity;
    }

    this.direction = direction;
    // animations
    this.animations.add("fire", [0], 8);
    this.animations.play("fire");
  }

  update() {
    if (this.direction === "vertical") {
      if (this.y < this.minHeight) {
        this.body.velocity.y = Math.abs(this.startVelocity);
        this.scale.y = -1;
      } else if (this.y > this.maxHeight) {
        this.body.velocity.y = -this.startVelocity;
        this.scale.y = 1;
      }
    } else if (this.direction === "horizontal") {
      console.log(this.x);
      if (this.x < this.minWidth) {
        this.body.velocity.x = Math.abs(this.startVelocity);
        this.scale.x = -1;
        console.log("1");
      } else if (this.x > this.maxWidth) {
        this.body.velocity.x = -this.startVelocity;
        this.scale.x = 1;
        console.log("2");
      }
    }
  }
}
