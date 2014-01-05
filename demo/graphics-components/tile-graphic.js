!function(window, PIXI, exports) {

  var Graphic = exports.Graphic,
      Frame = exports.Frame;

  var TileGraphic = Graphic.extend({
    init: function(position, direction, url, slice, offset) {
      this.frame = new Frame(position, url, {
        direction: direction,
        offset: offset,
        crop: slice
      });
    },
    render: function() {
      this.frame.render();
    },
    sprites: function() {
      return [this.frame.sprite];
    }
  });

  function updateLocation(graphic, position, direction, offset) {
    var gPos = graphic.sprite.position,
        gScale = graphic.sprite.scale;

    gPos.x = Math.round(position.x + offset.x);
    gPos.y = Math.round(position.y + offset.y);

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

  exports.TileGraphic = TileGraphic;

}(window, PIXI, demo);
