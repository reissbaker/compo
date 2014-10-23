'use strict';

var compo = require('compo'),
    GameData = require('./data/game-data'),
    TileGraphic = require('../graphics/tile-graphic'),
    Point = require('../data/point'),
    Character = require('./data/character'),
    buildPhysics = require('./components/physics');

var url = '/assets/allenemiessheet.png',
    pointUrl = '/assets/point.png';

module.exports = function(engine, world) {
  var entity = world.entity();
  var data = new GameData(0, 0, 4, 8, 19 - 4, 24 - 8);

  var physics = buildPhysics(engine, entity, data, 'npc');
  var graphics = buildGraphics(engine, entity, data);

  var width = document.body.clientWidth / 4;
  data.loc.x = Math.random() * width;

  return new Character(data, physics, graphics);
};

function buildGraphics(engine, entity, data) {
  var graphics = new TileGraphic(data.loc, data.dir, url, {
    x: 0, y: 0, width: 24, height: 24
  }, {
    midpoint: new Point(12, 12)
  });
  engine.renderer.table.attach(entity, graphics);

  var pointGraphic = new TileGraphic(data.loc, data.dir, pointUrl, {
    x: 0, y: 0, width: 1, height: 1
  });
  engine.renderer.table.attach(entity, pointGraphic);

  return graphics;
};
