!function(window, seine, PIXI, exports) {

  var Component = seine.Component,
      renderer = exports.renderer;

  var Graphics = Component.extend(function(node, url) {
    Component.call(this);
    this.node = node;

    var base = PIXI.BaseTexture.fromImage(url);
    var tex = new PIXI.Texture(base, {
      x: 0, y: 0, width: 48, height: 32
    });
    this.sprite = new PIXI.Sprite(tex);
    this.sprite.position.x = 0;
    this.sprite.position.y = 0;
  });

  Graphics.prototype.init = function() {
    renderer.stage.addChild(this.sprite);
  };

  Graphics.prototype.destroy = function() {
    renderer.stage.removeChild(this.sprite);
  };

  Graphics.prototype.update = function() {
    var pos = this.sprite.position;
    pos.x = Math.round(this.node.x);
    pos.y = Math.round(this.node.y);
  };

  exports.Graphics = Graphics;

}(window, seine, PIXI, demo);
