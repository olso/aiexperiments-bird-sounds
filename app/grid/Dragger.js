/*
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import TWEEN from "tween.js";
import PIXI from "pixi.js";
import Config from "../core/Config";

class Dragger {
  size = Config.draggerSize;
  constructor() {
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.defaultCursor = "pointer";

    const texture = PIXI.Texture.fromImage(
      Config.birdFFTSpriteSheet,
      false,
      PIXI.SCALE_MODES.NEAREST
    );
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.scale.x = this.size / 32.0;
    this.sprite.scale.y = this.size / 32.0;
    this.container.addChild(this.sprite);

    const myMask = new PIXI.Graphics();
    myMask.beginFill();
    myMask.drawRect(-this.size * 0.5, -this.size * 0.5, this.size, this.size);
    myMask.endFill();
    this.container.addChild(myMask);

    this.sprite.mask = myMask;

    const square = new PIXI.Graphics();
    square.beginFill(Config.colorHighlight, 0.0);
    square.lineStyle(2, Config.colorHighlight);
    square.drawRect(-this.size * 0.5, -this.size * 0.5, this.size, this.size);
    square.endFill();
    this.container.addChild(square);

    const field = new PIXI.Graphics();
    field.beginFill(Config.colorHighlight, 0.125);
    field.drawRect(-this.size * 0.5, -this.size * 0.5, this.size, this.size);
    field.endFill();
    field.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    square.addChild(field);

    const dot = new PIXI.Graphics();
    dot.beginFill(0xff00ff, 1.0);
    dot.drawRect(0, 0, 4, 4);
    dot.endFill();

    this.setSprite({ x: 60, y: 57, index: 567 });

    this.container.x = -200;
    this.container.y = -200;
    requestAnimationFrame(this.tweenAnimate);
  }

  highlight() {
    const state = { value: 1.25 };
    new TWEEN.Tween(state)
      .to({ value: 1 }, 100)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.container.scale.x = state.value;
        this.container.scale.y = state.value;
      })
      .start();
  }

  setSprite(obj) {
    this.sprite.x = -this.size * obj.x - this.size * 0.5;
    this.sprite.y = -this.size * obj.y - this.size * 0.5;
  }

  getContainer() {
    return this.container;
  }
  getPosition() {
    return this.container;
  }

  tweenAnimate = time => {
    requestAnimationFrame(this.tweenAnimate);
    TWEEN.update(time);
  };
}

export default Dragger;
