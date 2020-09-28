export default class LoadingState {
  init() {
    this.game.renderer.renderSession.roundPixels = true;
  }

  preload() {
    // json
    this.game.load.json("level:0", "../../assets/data/level00.json");
    this.game.load.json("level:1", "../../assets/data/level01.json");
    this.game.load.json("level:2", "../../assets/data/level02.json");
    // images
    this.game.load.image("font:numbers", "../../assets/images/numbers.png");
    this.game.load.image("font:letters", "../../assets/images/letters.png");
    this.game.load.image("background", "../../assets/images/background.png");
    this.game.load.image(
      "invisible-wall",
      "../../assets/images/invisible_wall.png"
    );
    this.game.load.image("block:16x1", "../../assets/images/block16.png");
    this.game.load.image("block:8x1", "../../assets/images/block8.png");
    this.game.load.image("block:4x1", "../../assets/images/block4.png");
    this.game.load.image("block:2x1", "../../assets/images/block2.png");
    this.game.load.image("block:1x1", "../../assets/images/block1.png");
    this.game.load.image("up-blaster", "../../assets/images/up-blaster.png");
    this.game.load.image(
      "down-blaster",
      "../../assets/images/down-blaster.png"
    );
    this.game.load.image(
      "left-blaster",
      "../../assets/images/left-blaster.png"
    );
    this.game.load.image(
      "right-blaster",
      "../../assets/images/right-blaster.png"
    );
    this.game.load.image(
      "still-platform",
      "../../assets/images/moving-block.png"
    );

    this.game.load.image(
      "moving-block",
      "../../assets/images/moving-block.png"
    );
    this.game.load.spritesheet(
      "flame",
      "../../assets/images/flame.png",
      30,
      38
    );
    this.game.load.image("blast", "../../assets/images/blast.png", 16, 22);
    // animations
    this.game.load.spritesheet("hero", "../../assets/images/hero.png", 50, 52);
    this.game.load.spritesheet(
      "drone",
      "../../assets/images/drone.png",
      40,
      38
    );
    this.game.load.spritesheet(
      "turret",
      "../../assets/images/turret.png",
      40,
      38
    );
    this.game.load.spritesheet(
      "energy",
      "../../assets/images/energy.png",
      24,
      24
    );
    this.game.load.spritesheet(
      "finish",
      "../../assets/images/finish.png",
      32,
      68
    );
    this.game.load.spritesheet("oil", "../../assets/images/oil.png", 42, 42);

    // audio
    this.game.load.audio("sfx:jump", "../../assets/audio/jump.wav");
    this.game.load.audio("sfx:energy", "../../assets/audio/energy.wav");
    this.game.load.audio("sfx:destroy", "../../assets/audio/destroy.wav");
    this.game.load.audio("sfx:dead", "../../assets/audio/dead.wav");
    this.game.load.audio("bgm", "../../assets/audio/bck.wav");
    this.game.load.audio("sfx:hurt", "../../assets/audio/hurt.ogg");
  }

  create() {
    this.game.state.start("play", true, false, {
      level: 2,
    });
  }
}
