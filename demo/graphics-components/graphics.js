!function(window, seine, PIXI, exports) {

  var Component = seine.Component;

  var Graphics = Component.extend({
    init: function(position, direction, url, slice) {
      this.pos = position;
      this.dir = direction;

      var base = PIXI.BaseTexture.fromImage(url);
      var tex = new PIXI.Texture(base, slice);
      this.sprite = new PIXI.Sprite(tex);

      updateLocation(this, this.pos, this.dir);
    },
    render: function() {
      updateLocation(this, this.pos, this.dir);
    }
  });

  function updateLocation(graphic, position, direction) {
    var gPos = graphic.sprite.position,
        gScale = graphic.sprite.scale;

    gPos.x = Math.round(position.x);
    gPos.y = Math.round(position.y);

    gScale.x = 1 * direction.x;
    gScale.y = 1 * direction.y;

    /*
     * Flipping will result in the sprite appearing to jump (flips on the 0,
     * rather than mid-sprite), so subtract the sprite's size from its position
     * if it's flipped.
     */

    if(gScale.x < 0) gPos.x -= graphic.sprite.width;
    if(gScale.y < 0) gPos.y -= graphic.sprite.height;
  }

  exports.Graphics = Graphics;

}(window, seine, PIXI, demo);
