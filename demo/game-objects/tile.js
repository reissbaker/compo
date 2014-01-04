!function(seine, exports) {
  'use strict';

  var GameObject = exports.GameObject,
      Graphics = exports.Graphics,
      TilePhysicsComponent = exports.TilePhysicsComponent,
      Matrix = exports.Matrix,
      Point = exports.Point,
      CollisionGrid = exports.CollisionGrid;

  exports.Tile = GameObject.extend({
    constructor: function() {
      GameObject.call(this, 0, 0, 48, 48);
    },

    start: function() {
      var matrix = new Matrix(1, 1),
          tileSize = new Point(48, 48);
      matrix.set(0, 0, 1);
      var grid = new CollisionGrid(this.loc, matrix, tileSize, [1]);
      this.push(grid);

      this.push(new Graphics(this.loc, this.dir, '/assets/tile.png', {
        x: 0, y: 0, width: 48, height: 48
      }));
    }
  });

}(seine, demo);
