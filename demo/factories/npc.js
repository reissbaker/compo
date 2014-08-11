'use strict';

var compo = require('compo'),
    GameData = require('./data/game-data'),
    physics = require('../physics/system'),
    Tile = require('../physics/tile'),
    TileGraphic = require('../graphics/tile-graphic'),
    renderer = require('../graphics/renderer'),
    Point = require('../data/point'),
    Character = require('./data/character');

var url = '/assets/allenemiessheet.png',
    pointUrl = '/assets/point.png',
    MAX_X_VEL = 10000,
    MAX_Y_VEL = 15000,
    GRAVITY = 1900,
    DRAG = 3000;

module.exports = function(entity) {
  var data = new GameData(0, 0, 4, 8, 19 - 4, 24 - 8);

  var physics = buildPhysics(entity, data);
  var graphics = buildGraphics(entity, data);

  var width = document.body.clientWidth / 4;
  data.loc.x = Math.random() * width;

  return new Character(data, physics, graphics);
};

function buildPhysics(entity, data) {
  var tilePhysics = new Tile(data.loc, data.hitbox);
  physics.tiles.attach(entity, tilePhysics);

  tilePhysics.gravity.y = GRAVITY;
  tilePhysics.maxVelocity.y = MAX_Y_VEL;
  tilePhysics.drag.x = DRAG;
  tilePhysics.maxVelocity.x = MAX_X_VEL;

  return tilePhysics;
}

function buildGraphics(entity, data) {
  var graphics = new TileGraphic(data.loc, data.dir, url, {
    x: 0, y: 0, width: 24, height: 24
  }, {
    midpoint: new Point(12, 12)
  });
  renderer.table.attach(entity, graphics);

  var pointGraphic = new TileGraphic(data.loc, data.dir, pointUrl, {
    x: 0, y: 0, width: 1, height: 1
  });
  renderer.table.attach(entity, pointGraphic);

  return graphics;
};
