!function(seine, exports) {
  'use strict';

  var Entity = seine.Entity,
      CollisionGrid = exports.CollisionGrid,
      Graphics = exports.Graphics,
      Position = exports.Position,
      Point = exports.Point,
      constants = exports.constants;

  exports.Level = Entity.extend({
    init: function(matrix) {
      this.matrix = matrix;
      this.loc = new Position;
    },
    start: function() {
      var r, c,
          tileSize = new Point(48, 48),
          grid = new CollisionGrid(
            this.loc, this.matrix, tileSize, constants.COLLIDABLE_TILES
          );

      this.push(grid);

      for(r = 0; r < this.matrix.numRows; r++) {
        for(c = 0; c < this.matrix.numCols; c++) {
          if(this.matrix.get(r, c) === 1) {
            this.push(new Graphics(
              new Position(
                this.loc.x + (c * tileSize.x),
                this.loc.y + (r * tileSize.y),
                0
              ),
              new Point(1, 1),
              '/assets/tile.png',
              { x: 0, y: 0, width: 48, height: 48 }
            ));
          }
        }
      }
    }
  });

}(seine, demo);
