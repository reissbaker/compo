'use strict';

var compo = require('compo'),
    physics = require('../physics/system'),
    renderer = require('../graphics/renderer'),
    CollisionGrid = require('../physics/grid'),
    GridGraphic = require('../graphics/grid-graphic'),
    Point = require('../data/point');

var url = '/assets/tile.png';

module.exports = function(entity, matrix) {
  this.entity = entity;
  this.loc = new Point;

  var tileSize = new Point(24, 24);

  this.grid = new CollisionGrid(this.loc, matrix, tileSize, [0]);
  physics.grids.attach(entity, this.grid);

  this.graphics = new GridGraphic(this.loc, url, matrix, tileSize);
  renderer.table.attach(entity, this.graphics);
};
