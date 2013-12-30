!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Position = exports.Position,
      Rect = exports.Rect,
      Direction = exports.Direction;

  exports.GameObject = Component.extend({
    constructor: function(x, y, width, height) {
      Component.call(this);
      this.loc = new Position;
      this.hitbox = new Rect(x, y, width, height);
      this.dir = new Direction;
    }
  });

}(seine, demo);
