import Hero from "../sprites/Hero";
import Flame from "../sprites/Flame";
import Enemy from "../sprites/Enemy";
import Block from "../sprites/Block";
import Blast from "../sprites/Blast";

export default class SpriteState {
  spawnCharacters(data) {
    // spawn enemies
    data.enemies.forEach(function (enemy) {
      let sprite = new Enemy(
        this.game,
        enemy.x,
        enemy.y,
        enemy.image,
        enemy.gravity
      );
      this.enemies.add(sprite);
    }, this);
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
  }

  spawnPlatform(platform) {
    let sprite = this.platforms.create(platform.x, platform.y, platform.image);
    // physics for platform sprites
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    // spawn invisible walls at each side, only detectable by enemies
    this.spawnEnemyWall(platform.x, platform.y, "left");
    this.spawnEnemyWall(platform.x + sprite.width, platform.y, "right");
  }

  spawnMovingBlocks(block) {
    let sprite = new Block(this.game, block.x, block.y);
    this.movingBlocks.add(sprite);
  }

  spawnOil(oil) {
    let sprite = this.oil.create(oil.x, oil.y, oil.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    // animations
    sprite.animations.add("flow", [0, 1, 2], 6, true);
    sprite.animations.play("flow");
  }

  spawnBlast(data) {
    data.blast.forEach(function (blast) {
      let sprite = new Blast(
        this.game,
        blast.x,
        blast.y,
        blast.height,
        blast.velocity
      );
      this.blast.add(sprite);
    }, this);
  }

  spawnFlame(data) {
    data.flame.forEach(function (s) {
      let sprite = new Flame(this.game, s.x, s.y, s.image, s.duration);
      this.flame.add(sprite);
    }, this);
  }

  spawnEnemyWall(x, y, side) {
    let sprite = this.enemyWalls.create(x, y, "invisible-wall");
    // anchor and y displacement
    sprite.anchor.set(side === "left" ? 1 : 0, 1);
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
  }

  spawnEnergy(energy) {
    let sprite = this.energy.create(energy.x, energy.y, "energy");
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    // animations
    sprite.animations.add("rotate", [0, 1], 4, true);
    sprite.animations.play("rotate");
  }

  spawnFinish(data) {
    let sprite = this.finish.create(data.finish.x, data.finish.y, "finish");
    this.game.physics.enable(sprite);
    sprite.anchor.setTo(0.5, 1);
    sprite.body.allowGravity = false;
    sprite.animations.add("open", [0, 1, 2, 3], 5, true);
    sprite.animations.play("open");
  }
}
