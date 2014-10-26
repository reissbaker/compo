'use strict';

var compo = require('compo'),
    Collidable = require('./collidable'),
    Rect = require('../data/rect');

var CollisionGrid = compo.extend(compo.Component, function(loc, matrix, tileSize, collisionTiles, type) {
  this.loc = loc;
  this.matrix = matrix;
  this.tileSize = tileSize;
  this.type = type;

  this.collisionMap = collisionMap(collisionTiles);
  this.collidables = collidables(loc, tileSize, matrix, type);
  this._hitbox = new Rect(
    this.loc.x,
    this.loc.y,
    this.width(),
    this.height()
  );
});

CollisionGrid.prototype.hitbox = function() {
  this._hitbox.x = this.loc.x;
  this._hitbox.y = this.loc.y;
  return this._hitbox;
};

CollisionGrid.prototype.width = function() {
  return this.matrix.numCols * this.tileSize.x;
};

CollisionGrid.prototype.height = function() {
  return this.matrix.numRows * this.tileSize.y;
};

CollisionGrid.prototype.isCollidable = function(row, col) {
  var tile = this.matrix.get(row, col);
  return !!this.collisionMap[tile];
};

CollisionGrid.prototype.collidable = function(row, col) {
  if(this.isCollidable(row, col)) return this.collidables[row][col];
  return null;
};

function collisionMap(collidableTiles) {
  var i, l,
      collisionMap = [];
  for(i = 0, l = collidableTiles.length; i < l; i++) {
    collisionMap[collidableTiles[i]] = true;
  }
  return collisionMap;
}

function collidables(loc, tileSize, matrix, type) {
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
        ),
        type
      ));
    }
  }
  return collidables;
}

module.exports = CollisionGrid;
