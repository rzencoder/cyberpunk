import "pixi";
import "p2";
import Phaser from "phaser";

import LoadingState from "./states/LoadingState";
import PlayState from "./states/PlayState";

import { config } from "./constants/constants.js";

window.onload = function () {
  let game = new Phaser.Game(
    config.gameWidth,
    config.gameHeight,
    Phaser.CANVAS,
    "game"
  );
  game.state.add("play", PlayState);
  game.state.add("loading", LoadingState);
  game.state.start("loading");
};

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        "deviceready",
        this.onDeviceReady.bind(this),
        false
      );
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent("deviceready");

      // When the device is ready, start Phaser Boot state.
      window.game.state.start("Boot");
    },

    receivedEvent: function (id) {
      console.log("Received Event: " + id);
    },
  };

  app.initialize();
}
