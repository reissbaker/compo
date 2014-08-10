'use strict';

var PIXI = window.PIXI,
    Point = require('../data/point'),
    Rect = require('../data/rect');

function Clip(options) {
  this.pos = options.position;
  this.dir = options.direction || new Point(1, 1);
  this.offset = options.offset || new Point(0, 0);

  this.elapsed = 0;
  this.frameIndex = 0;
  this.frameTime = options.frameTime;
  this.numFrames = options.numFrames;

  var i,
      numFrames = options.numFrames,
      texes = [],
      base = PIXI.BaseTexture.fromImage(options.url, false, PIXI.scaleModes.NEAREST),
      slice = options.crop || new Rect(0, 0, base.width, base.height),
      frameWidth = slice.width / numFrames;

  for(i = 0; i < numFrames; i++) {
    texes.push(new PIXI.Texture(base, {
      x: frameWidth * i,
      y: slice.y,
      width: frameWidth,
      height: slice.height
    }));
  }

  this.midpoint = options.midpoint || new Point(slice.width / 2, slice.height / 2);
  this.sprite = new PIXI.MovieClip(texes);
}

Clip.prototype.render = function(scale, delta) {
  var gPos = this.sprite.position,
      gScale = this.sprite.scale;

  gPos.x = (this.pos.x + this.offset.x) * scale.x;
  gPos.y = (this.pos.y + this.offset.y) * scale.y;

  gScale.x = this.dir.x * scale.x;
  gScale.y = this.dir.y * scale.y;

  /*
   * Flipping will result in the sprite appearing to jump (flips on the 0,
   * rather than mid-sprite), so add the sprite's midpoint * 2 to the current
   * position.
   */

  if(gScale.x < 0) {
    gPos.x += this.midpoint.x * 2 * scale.x;
  }
  if(gScale.y < 0) {
    gPos.y += this.midpoint.y * 2 * scale.y;
  }

  this.elapsed += delta;
  while(this.elapsed > this.frameTime) {
    this.elapsed -= this.frameTime;
    this.frameIndex = (this.frameIndex + 1) % this.numFrames;
  }
  this.sprite.gotoAndStop(this.frameIndex);
};

module.exports = Clip;

