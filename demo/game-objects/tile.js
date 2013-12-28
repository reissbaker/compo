!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Graphics = exports.Graphics,
      Direction = exports.Direction,
      Rect = exports.Rect,
      TilePhysicsComponent = exports.TilePhysicsComponent;

  exports.Tile = Component.extend({
    constructor: function() {
      Component.call(this);
      this.hitbox = new Rect(0, 0, 48, 32);
      this.dir = new Direction;
    },
    init: function() {
      var physics = new TilePhysicsComponent(this.hitbox);
      physics.immovable = true;
      this.push(physics);

      this.push(new Graphics(this.hitbox, this.dir, '/assets/tile.png', {
        x: 0, y: 0, width: 48, height: 48
      }));
    }
  });

}(seine, demo);
