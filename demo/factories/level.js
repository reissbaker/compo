'use strict';

var compo = require('compo'),
    CollisionGrid = require('../physics/grid'),
    GridGraphic = require('../graphics/grid-graphic'),
    Point = require('../data/point');

var url = '/assets/tile.png';

module.exports = function(engine, entity, matrix) {
  var loc = new Point;
  var tileSize = new Point(24, 24);

  var grid = new CollisionGrid(loc, matrix, tileSize, [0], 'level');
  engine.physics.grids.attach(entity, grid);

  var graphics = new GridGraphic(loc, url, matrix, tileSize);
  engine.renderer.table.attach(entity, graphics);

  return new Level(loc, grid, graphics);
};

function Level(loc, grid, graphics) {
  this.loc = loc;
  this.grid = grid;
  this.graphics = graphics;
}
