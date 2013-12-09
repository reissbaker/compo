!function(window, seine, PIXI, exports) {

  var Component = seine.Component,
      renderer = exports.renderer;

  var Graphics = Component.extend({
    constructor: function(node, url) {
      Component.call(this);
      this.node = node;

      var base = PIXI.BaseTexture.fromImage(url);
      var tex = new PIXI.Texture(base, {
        x: 0, y: 0, width: 48, height: 32
      });
      this.sprite = new PIXI.Sprite(tex);

      updateLocation(this.node, this);
    },
    init: function() {
      renderer.stage.addChild(this.sprite);
    },
    destroy: function() {
      renderer.stage.removeChild(this.sprite);
    },
    render: function() {
      updateLocation(this.node, this);
    }
  });

  function updateLocation(node, graphic) {
    var pos = graphic.sprite.position,
        scale = graphic.sprite.scale;

    pos.x = Math.round(node.x);
    pos.y = Math.round(node.y);

    scale.x = 1 * node.dir.x;
    scale.y = 1 * node.dir.y;

    /*
     * Flipping will result in the sprite appearing to jump (flips on the 0,
     * rather than mid-sprite), so subtract the sprite's size from its position
     * if it's flipped.
     */

    if(scale.x < 0) pos.x -= graphic.sprite.width;
    if(scale.y < 0) pos.y -= graphic.sprite.height;
  }

  exports.Graphics = Graphics;

}(window, seine, PIXI, demo);
