!function(seine, exports) {
  'use strict';

  var GameObject = exports.GameObject,
      Graphics = exports.Graphics,
      TilePhysicsComponent = exports.TilePhysicsComponent;

  exports.Tile = GameObject.extend({
    constructor: function() {
      GameObject.call(this, 0, 0, 48, 48);
    },

    start: function() {
      var physics = new TilePhysicsComponent(this.loc, this.hitbox);
      physics.immovable = true;
      this.push(physics);

      this.push(new Graphics(this.loc, this.dir, '/assets/tile.png', {
        x: 0, y: 0, width: 48, height: 48
      }));
    }
  });

}(seine, demo);
