import Phaser from "phaser";

export default class Hero extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, "hero");
    this.invincible = false;
    this.hurt = false;
    this.anchor.set(0.5, 0.5);
    // physics properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    // animations
    this.animations.add("stop", [12, 13, 14, 15], 8, true);
    this.animations.add("run-right", [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    this.animations.add("run-left", [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    this.animations.add("jump", [8, 9, 10, 11], 15, true);
    this.animations.add("die", [16, 17, 18, 19, 20], 25);
    this.animations.add("hurt", [16]); // 12fps no loop
    this.animations.play("stop");
  }
  move(direction) {
    // guard
    if (this.isFrozen) {
      return;
    }
    if (this.hurt) {
      if (this.body.velocity.x > 0) {
        this.body.velocity.x = 200;
        this.body.velocity.y = -50;
      } else {
        this.body.velocity.x = -50;
        this.body.velocity.y = -50;
      }
      this.body.enable = false;
      setTimeout(() => {
        this.body.enable = true;
      }, 500);
    }
    this.body.velocity.x = direction * 200;
    // update image flipping & animations
    if (this.body.velocity.x < 0) {
      this.scale.x = -1;
    } else if (this.body.velocity.x > 0) {
      this.scale.x = 1;
    }
  }

  jump(springSpeed) {
    let canJump =
      this.body.touching.down && this.alive && !this.isFrozen && !this.hurt;
    const JUMP_SPEED = 470;
    if (canJump || this.isBoosting) {
      this.body.velocity.y = -springSpeed || -JUMP_SPEED;
      this.isBoosting = true;
    }
    return canJump;
  }

  stopJumpBoost() {
    this.isBoosting = false;
  }

  bounce() {
    this.body.velocity.y = -200;
  }

  injure() {
    this.invincible = true;
    this.hurt = true;
    setTimeout(() => {
      this.hurt = false;
    }, 500);
    setTimeout(() => {
      this.invincible = false;
    }, 2000);
  }

  update() {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
      this.animations.play(animationName);
    }
  }

  freeze() {
    this.body.enable = false;
    this.isFrozen = true;
  }

  die() {
    this.alive = false;
    this.body.enable = false;
    this.animations.play("die").onComplete.addOnce(() => {
      setTimeout(() => {
        this.kill();
      }, 750);
    });
  }

  _getAnimationName() {
    let name = "stop"; // default animation
    if (!this.alive) {
      name = "die";
    } else if (this.isFrozen) {
      name = "stop";
    } else if (this.hurt) {
      name = "hurt";
    } else if (this.body.velocity.y < 0 || this.body.velocity.y > 0) {
      name = "jump";
    } else if (this.body.velocity.x > 0 && this.body.touching.down) {
      name = "run-right";
    } else if (this.body.velocity.x < 0 && this.body.touching.down) {
      name = "run-left";
    }
    return name;
  }
}
