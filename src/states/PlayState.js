import Phaser from "phaser";

import SpriteState from "./SpriteState";
import { LEVEL_COUNT } from "../constants/constants";

export default class PlayState extends SpriteState {
  init(data) {
    this.keys = this.game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP,
    });
    this.ringCount = 0;
    this.score = 0;
    this.level = (data.level || 0) % LEVEL_COUNT;
    this.bgm = this.game.add.audio("bgm");
    this.bgm.loopFull();
  }

  create() {
    // fade in (from black)
    this.camera.flash("#000000");
    // create sound entities
    this.sfx = {
      jump: this.game.add.audio("sfx:jump"),
      energy: this.game.add.audio("sfx:energy"),
      destroy: this.game.add.audio("sfx:destroy"),
      hurt: this.game.add.audio("sfx:hurt"),
      dead: this.game.add.audio("sfx:dead"),
    };

    // create level entities and decoration
    this.game.add.image(0, 0, "background");
    this.loadLevel(this.game.cache.getJSON(`level:${this.level}`));
    // create UI score boards
    this.createHud();
  }

  update() {
    this.handleCollisions();
    this.handleInput();
    // update scoreboards
    this.scoreNumber.text = `${this.score}`;
    this.ringNumber.text = `${this.ringCount}`;
  }

  shutdown() {
    this.bgm.stop();
  }

  handleCollisions() {
    this.game.physics.arcade.collide(this.enemies, this.platforms);
    this.game.physics.arcade.collide(this.enemies, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.collide(this.hero, this.movingBlocks);
    this.game.physics.arcade.collide(this.movingBlocks, this.platforms);
    this.game.physics.arcade.collide(this.movingBlocks, this.movingBlocks);

    // collision: hero vs enemies (kill or die)
    this.game.physics.arcade.overlap(
      this.hero,
      this.enemies,
      this.onHeroVsEnemy,
      null,
      this
    );
    // collision: oil
    this.game.physics.arcade.collide(
      this.hero,
      this.oil,
      this.handleDamage,
      null,
      this
    );
    // collision: blast
    this.game.physics.arcade.overlap(
      this.hero,
      this.blast,
      this.handleDamage,
      null,
      this
    );
    // collision: flames
    this.game.physics.arcade.overlap(
      this.hero,
      this.flame,
      this.handleDamage,
      null,
      this
    );
    // collision: energy
    this.game.physics.arcade.overlap(
      this.hero,
      this.energy,
      this.onHeroVsRing,
      null,
      this
    );
    // collision: finish
    this.game.physics.arcade.overlap(
      this.hero,
      this.finish,
      this.onHeroVsFinish,
      // ignore if there is no key or the player is on air
      function (hero, finish) {
        return hero.body.touching.down;
      },
      this
    );
  }

  handleInput() {
    if (this.keys.left.isDown) {
      // move hero left
      this.hero.move(-1);
    } else if (this.keys.right.isDown) {
      // move hero right
      this.hero.move(1);
    } else {
      // stop
      this.hero.move(0);
    }
    // handle jump
    if (this.keys.up.downDuration(200)) {
      let didJump = this.hero.jump();
      didJump ? this.sfx.jump.play() : this.hero.stopJumpBoost();
    }
  }

  onHeroVsRing(hero, ring) {
    this.sfx.energy.play();
    ring.kill();
    this.ringCount++;
  }

  handleDamage(hero) {
    if (this.ringCount === 0 && !hero.invincible) {
      hero.die();
      this.sfx.dead.play();
      hero.events.onKilled.addOnce(() => {
        this.game.state.restart(true, false, {
          level: this.level,
        });
      });
    } else if (hero.invincible) {
    } else {
      this.ringCount = 0;
      hero.injure();
      this.sfx.hurt.play();
    }
  }

  onHeroVsEnemy(hero, enemy) {
    // the hero can kill enemies when is falling (after a jump, or a fall)
    if (hero.body.velocity.y !== 0) {
      enemy.die();
      hero.bounce();
      this.sfx.destroy.play();
      this.score += 100;
    } else {
      this.handleDamage(hero);
      // NOTE: bug in phaser in which it modifies 'touching' when
      // checking for overlaps. This undoes that change so enemies don't
      // 'bounce' agains the hero
      enemy.body.touching = enemy.body.wasTouching;
    }
  }

  onHeroVsFinish(hero, finish) {
    finish.animations.play("open");
    // play animation and change to the next level when it ends
    hero.freeze();
    this.game.add
      .tween(hero)
      .to(
        {
          x: 940,
          alpha: 0,
        },
        500,
        null,
        true
      )
      .onComplete.addOnce(this.goToNextLevel, this);
  }

  goToNextLevel() {
    this.camera.fade("#000000");
    this.camera.onFadeComplete.addOnce(function () {
      // change to next level
      this.game.state.restart(true, false, {
        level: this.level + 1,
        score: this.score + 1000,
      });
    }, this);
  }

  loadLevel(data) {
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.energy = this.game.add.group();
    this.enemies = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    this.movingBlocks = this.game.add.group();
    this.blast = this.game.add.group();
    this.oil = this.game.add.group();
    this.flame = this.game.add.group();
    this.platforms = this.game.add.group();
    this.finish = this.game.add.group();
    // spawn
    this.spawnCharacters({
      hero: data.hero,
      enemies: data.enemies,
    });
    data.platforms.forEach(this.spawnPlatform, this);
    data.movingBlocks.forEach(this.spawnMovingBlocks, this);
    data.oil.forEach(this.spawnOil, this);
    data.energy.forEach(this.spawnEnergy, this);
    this.spawnFlame({
      flame: data.flame,
    });
    this.spawnBlast({
      blast: data.blast,
    });
    this.spawnFinish({
      finish: data.finish,
    });
    data.decoration.forEach(function (deco) {
      this.bgDecoration.add(
        this.game.add.image(deco.x, deco.y, "decoration", deco.frame)
      );
    }, this);

    // enable gravity
    this.game.physics.arcade.gravity.y = 1200;
  }

  createHud() {
    const NUMBERS_STR = "0123456789";
    const LETTERS_STR = "SCORENGY";
    this.scoreText = this.game.add.retroFont(
      "font:letters",
      20,
      20,
      LETTERS_STR,
      10
    );
    this.ringText = this.game.add.retroFont(
      "font:letters",
      20,
      20,
      LETTERS_STR,
      10
    );
    this.scoreNumber = this.game.add.retroFont(
      "font:numbers",
      20,
      20,
      NUMBERS_STR,
      10
    );
    this.ringNumber = this.game.add.retroFont(
      "font:numbers",
      20,
      20,
      NUMBERS_STR,
      10
    );

    this.scoreText.text = `SCORE`;
    this.ringText.text = `ENERGY`;

    let scoreTextImage = this.game.make.image(50, 25, this.scoreText);
    let energyTextImage = this.game.make.image(50, 25, this.ringText);
    let scoreNumberImage = this.game.make.image(50, 25, this.scoreNumber);
    let energyNumberImage = this.game.make.image(50, 25, this.ringNumber);

    this.hud = this.game.add.group();
    this.hud.add(scoreTextImage);
    this.hud.add(energyTextImage);
    this.hud.add(scoreNumberImage);
    this.hud.add(energyNumberImage);

    this.hud.position.set(10, 10);
    this.hud.children[0].position.set(20, 20);
    this.hud.children[1].position.set(20, 50);
    this.hud.children[2].position.set(160, 20);
    this.hud.children[3].position.set(160, 50);
    console.log(this.hud.children[3]);
  }
}
