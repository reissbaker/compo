!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Collidable = exports.Collidable,
      Rect = exports.Rect;

  exports.CollisionGrid = Component.extend({
    init: function(loc, matrix, tileSize, collisionTiles) {
      this.loc = loc;
      this.matrix = matrix;
      this.tileSize = tileSize;

      this.collisionMap = collisionMap(collisionTiles);
      this.collidables = collidables(loc, tileSize, matrix);
      this._hitbox = new Rect(
        this.loc.x,
        this.loc.y,
        this.width(),
        this.height()
      );
    },
    hitbox: function() {
      this._hitbox.x = this.loc.x;
      this._hitbox.y = this.loc.y;
      return this._hitbox;
    },
    width: function() {
      return this.matrix.numCols * this.tileSize.x;
    },
    height: function() {
      return this.matrix.numRows * this.tileSize.y
    },
    isCollidable: function(row, col) {
      var tile = this.matrix.get(row, col);
      return !!this.collisionMap[tile];
    },
    collidable: function(row, col) {
      if(this.isCollidable(row, col)) return this.collidables[row][col];
      return null;
    }
  });

  function collisionMap(collidableTiles) {
    var i, l,
        collisionMap = [];
    for(i = 0, l = collidableTiles.length; i < l; i++) {
      collisionMap[collidableTiles[i]] = true;
    }
    return collisionMap;
  }

  function collidables(loc, tileSize, matrix) {
    var r, c,
        collidables = [];
    for(r = 0; r < matrix.numRows; r++) {
      collidables.push([]);
      for(c = 0; c < matrix.numCols; c++) {
        collidables[r].push(new Collidable(
          loc,
          new Rect(
            c * tileSize.x,
            r * tileSize.y,
            tileSize.x,
            tileSize.y
          )
        ));
      }
    }
    return collidables;
  }

}(seine, demo);
