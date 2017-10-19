import PIXI from "pixi.js";
// import Stats from "stats.js";
import TWEEN from "tween.js";

import Config from "../core/Config";
import Dragger from "./Dragger";
// import Data from "../core/Data";
import "../style/grid.css";

class Grid {
  constructor() {
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    const { loader } = PIXI;
    loader.add("spritSheet", Config.birdFFTSpriteSheet);
    loader.once("complete", () => {
      this.onSpriteSheetLoaded();
    });
    loader.load();
    requestAnimationFrame(Grid.tweenAnimate);
  }

  renderer;
  stage;
  base;
  debug;

  static tweenAnimate = time => {
    requestAnimationFrame(Grid.tweenAnimate);
    TWEEN.update(time);
  };

  onSpriteSheetLoaded() {
    this.renderer = new PIXI.WebGLRenderer(
      window.innerWidth,
      window.innerHeight,
      {
        backgroundColor: 0xf2efea,
        antialias: false,
        transparent: false,
        resolution: 1,
        roundPixels: true
      },
      true
    );

    const grid = document.getElementById("grid");
    grid.appendChild(this.renderer.view);
    this.stage = new PIXI.Container();
    this.base = new PIXI.Graphics();
    this.stage.addChild(this.base);

    this.birdGrid = new PIXI.Container();
    this.birdGrid.defaultCursor = "pointer";
    this.base.addChild(this.birdGrid);

    this.birdGridOutline = new PIXI.Graphics();
    this.base.addChild(this.birdGridOutline);

    /* BIRD GRID TEXTURE */
    const texture = PIXI.Texture.fromImage(
      Config.birdFFTSpriteSheet,
      false,
      PIXI.SCALE_MODES.NEAREST
    );

    this.sprite = new PIXI.Sprite(texture);
    this.sprite.storedWidth = this.sprite.width;
    this.sprite.storedHeight = this.sprite.height;
    this.birdGrid.addChild(this.sprite);

    const field = new PIXI.Graphics();
    field.beginFill(0x65b1b3, 0.125);
    field.drawRect(0, 0, this.sprite.width, this.sprite.height);
    field.endFill();
    field.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    this.birdGrid.field = field;
    this.birdGrid.field.visible = false;
    this.birdGrid.addChild(field);

    /** @todo check this is being used */
    this.debugBox = new PIXI.Graphics();
    this.debugBox.beginFill(0xff0000, 1.0);
    this.debugBox.drawRect(0, 0, 100, 100);
    this.debugBox.endFill();
    this.debugBox.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    this.debugBox.x = 50;
    this.debugBox.y = 50;
    /** end */

    /** CENTERS BIRD GRID */
    this.birdGrid.x = (window.innerWidth - this.birdGrid.width) * 0.5;
    this.birdGrid.y = (window.innerHeight - this.birdGrid.height) * 0.5;

    this.dragger = new Dragger();
    const draggerContainer = this.dragger.getContainer();
    this.base.addChild(draggerContainer);
    draggerContainer.visible = false;
  }
}

export default Grid;
