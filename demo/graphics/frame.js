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

  this.midpoint = options.midpoint ||
                  new Point((slice.width / 2), (slice.height / 2));

  this.sprite = new PIXI.Sprite(tex);
}

Frame.prototype.render = function(camera, scale) {
  var gPos = this.sprite.position,
      gScale = this.sprite.scale;

  gPos.x = ((-camera.getX() + this.pos.x + this.offset.x) * scale.x) | 0;
  gPos.y = ((-camera.getY() + this.pos.y + this.offset.y) * scale.y) | 0;

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
};


module.exports = Frame;
