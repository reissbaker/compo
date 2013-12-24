!function(seine, exports) {
  'use strict';

  var Position = exports.Position,
      Direction = exports.Direction,
      Component = seine.Component,
      Graphics = exports.Graphics,
      Dimension = exports.Dimension,
      RandomPlacement = exports.RandomPlacement;

  exports.NPC = Component.extend({
    constructor: function() {
      Component.call(this);
      this.pos = new Position;
      this.dir = new Direction;
      this.dim = new Dimension(48, 32);
    },
    init: function() {
      this.push(new RandomPlacement(this.pos));
      this.push(new Graphics(this.pos, this.dir, '/swordguy.png', {
        x: 0, y: 0, width: 48, height: 32
      }));
    }
  });
}(seine, demo);
