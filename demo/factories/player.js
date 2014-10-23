'use strict';

var compo = require('compo'),
    GameData = require('./data/game-data'),
    Controller = require('../behavior/keyboard-controller'),
    Character = require('./data/character'),
    PlayerStateMachine = require('./state/player-machine'),
    buildGraphics = require('./components/player-animation'),
    buildPhysics = require('./components/physics');

module.exports = function(engine, world) {
  var entity = world.entity();
  var data = new GameData(0, 0, 4, 9, 20 - 4, 24 - 9);

  var physics = buildPhysics(engine, entity, data, 'player');
  var graphics = buildGraphics(engine, entity, data);

  var character = new Character(data, physics, graphics);

  var states = new PlayerStateMachine({
    world: world,
    engine: engine,
    character: character
  });

  engine.behavior.table.attach(entity, new Controller(character, states));

  physics.emitter.on('collide:bottom', function() {
    states.land();
  });

  return character;
};

