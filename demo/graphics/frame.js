'use strict';

var PIXI = window.PIXI,
    Point = require('../data/point'),
    Rect = require('../data/rect');

function Frame(position, url, options) {
  this.pos = position;
  this.dir = options.direction || new Point(1, 1);
  this.offset = options.offset || new Point(0, 0);

  var base = PIXI.BaseTexture.fromImage(url, false, PIXI.scaleModes.NEAREST),
      slice = options.crop || new Rect(0, 0, base.width, base.height),
      tex = new PIXI.Texture(base, slice);

  this.sprite = new PIXI.Sprite(tex);

  this.render();
}

Frame.prototype.render = function() {
  var gPos = this.sprite.position,
      gScale = this.sprite.scale;

  gPos.x = this.pos.x + this.offset.x;
  gPos.y = this.pos.y + this.offset.y;

  gScale.x = this.dir.x;
  gScale.y = this.dir.y;

  /*
   * Flipping will result in the sprite appearing to jump (flips on the 0,
   * rather than mid-sprite), so subtract the sprite's size from its position
   * if it's flipped. To handle rotation around the offset, multiply the offset
   * by 1.5 for MATH REASONS and add it (or rather, subtract it from the
   * subtraction).
   */

  if(gScale.x < 0) {
    gPos.x -= this.sprite.width - ((this.offset.x * 1.5) | 0);
  }
  if(gScale.y < 0) {
    gPos.y -= this.sprite.height - ((this.offset.y * 1.5) | 0);
  }
};


module.exports = Frame;
