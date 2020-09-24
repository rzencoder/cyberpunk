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
    this.game.load.image("background", "../../assets/images/bg.png");
    this.game.load.image(
      "invisible-wall",
      "../../assets/images/invisible_wall.png"
    );
    this.game.load.image("stone:16x1", "../../assets/images/stone16.png");
    this.game.load.image("stone:8x1", "../../assets/images/stone8.png");
    this.game.load.image("stone:4x1", "../../assets/images/stone4.png");
    this.game.load.image("stone:2x1", "../../assets/images/stone2.png");
    this.game.load.image("stone:1x1", "../../assets/images/stone1.png");
    this.game.load.image("block", "../../assets/images/block2.png");
    this.game.load.image(
      "finish-static",
      "../../assets/images/finish-static.png"
    );
    this.game.load.image("spike", "../../assets/images/spike1.png");
    this.game.load.image("spike3", "../../assets/images/spike3.png");
    this.game.load.image(
      "fireball",
      "../../assets/images/fireball.png",
      15,
      32
    );
    // animations
    this.game.load.spritesheet(
      "hero",
      "../../assets/images/hero-2.png",
      50,
      52
    );
    this.game.load.spritesheet("bug", "../../assets/images/bug.png", 40, 30);
    this.game.load.spritesheet("bat", "../../assets/images/bat.png", 30, 30);
    this.game.load.spritesheet("ring", "../../assets/images/ring.png", 16, 16);
    this.game.load.spritesheet(
      "finish",
      "../../assets/images/finish.png",
      45,
      64
    );
    this.game.load.spritesheet(
      "spring",
      "../../assets/images/spring.png",
      28,
      16
    );
    this.game.load.spritesheet("lava", "../../assets/images/lava2.png", 42, 42);

    // audio
    this.game.load.audio("sfx:jump", "../../assets/audio/jump.wav");
    this.game.load.audio("sfx:spring", "../../assets/audio/spring.wav");
    this.game.load.audio("sfx:ring", "../../assets/audio/ring.wav");
    this.game.load.audio("sfx:pop", "../../assets/audio/pop.wav");
    this.game.load.audio("sfx:finish", "../../assets/audio/finish.wav");
    this.game.load.audio("sfx:dead", "../../assets/audio/dead.wav");
    this.game.load.audio("bgm", "../../assets/audio/bck.mp3");
    this.game.load.audio("sfx:hurt", "../../assets/audio/hurt.wav");
  }

  create() {
    this.game.state.start("play", true, false, {
      level: 0,
    });
  }
}
