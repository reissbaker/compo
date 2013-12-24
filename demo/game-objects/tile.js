!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Graphics = exports.Graphics,
      Position = exports.Position,
      Direction = exports.Direction,
      Dimension = exports.Dimension;

  exports.Tile = Component.extend({
    constructor: function() {
      Component.call(this);
      this.pos = new Position;
      this.dir = new Direction;
      this.dim = new Dimension(48, 48);
    },
    init: function() {
      this.push(new Graphics(this.pos, this.dir, '/tile.png', {
        x: 0, y: 0, width: 48, height: 48
      }));
    }
  });

}(seine, demo);
