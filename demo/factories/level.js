'use strict';

var compo = require('compo'),
    physics = require('../physics/system'),
    renderer = require('../graphics/renderer'),
    CollisionGrid = require('../physics/grid'),
    GridGraphic = require('../graphics/grid-graphic'),
    Point = require('../data/point');

var url = '/assets/tile.png';

module.exports = function(entity, matrix) {
  var loc = new Point;
  var tileSize = new Point(24, 24);

  var grid = new CollisionGrid(loc, matrix, tileSize, [0]);
  physics.grids.attach(entity, grid);

  var graphics = new GridGraphic(loc, url, matrix, tileSize);
  renderer.table.attach(entity, graphics);

  return new Level(loc, grid, graphics);
};

function Level(loc, grid, graphics) {
  this.loc = loc;
  this.grid = grid;
  this.graphics = graphics;
}
