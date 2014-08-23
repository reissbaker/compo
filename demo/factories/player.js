'use strict';

var compo = require('compo'),
    GameData = require('./data/game-data'),
    Controller = require('../behavior/keyboard-controller'),
    Character = require('./data/character'),
    buildGraphics = require('./components/player-animation'),
    buildPhysics = require('./components/physics');

module.exports = function(engine, entity) {
  var data = new GameData(0, 0, 4, 9, 20 - 4, 24 - 9);

  var physics = buildPhysics(engine, entity, data);
  var graphics = buildGraphics(engine, entity, data);

  engine.behavior.table.attach(entity, new Controller(
    data.dir,
    physics,
    graphics
  ));

  return new Character(data, physics, graphics);
};

