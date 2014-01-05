!function(PIXI, exports) {
  'use strict';

  var Point = exports.Point,
      Rect = exports.Rect;

  function Frame(position, url, options) {
    this.pos = position;
    this.dir = options.direction || new Point(1, 1);
    this.offset = options.offset || new Point(0, 0);

    var base = PIXI.BaseTexture.fromImage(url),
        slice = options.crop || new Rect(0, 0, base.width, base.height),
        tex = new PIXI.Texture(base, slice);

    this.sprite = new PIXI.Sprite(tex);

    this.render();
  }

  Frame.prototype.render = function() {
    var gPos = this.sprite.position,
        gScale = this.sprite.scale;

    gPos.x = Math.round(this.pos.x + this.offset.x);
    gPos.y = Math.round(this.pos.y + this.offset.y);

    gScale.x = this.dir.x;
    gScale.y = this.dir.y;

    /*
     * Flipping will result in the sprite appearing to jump (flips on the 0,
     * rather than mid-sprite), so subtract the sprite's size from its position
     * if it's flipped.
     */

    if(gScale.x < 0) gPos.x -= this.sprite.width;
    if(gScale.y < 0) gPos.y -= this.sprite.height;
  };


  exports.Frame = Frame;

}(PIXI, demo);