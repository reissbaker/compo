'use strict';

var compo = require('compo'),
    NpcController = require('../../behavior/npc-controller'),
    RabbitStateMachine = require('./state/machine'),
    GameData = require('../shared/game-data'),
    TileGraphic = require('../../graphics/tile-graphic'),
    Point = require('../../data/point'),
    Character = require('../shared/character'),
    buildGraphics = require('./animation'),
    buildPhysics = require('../shared/character-physics');

module.exports = function(engine, world) {
  var entity = world.entity();
  var data = new GameData(0, 0, 4, 8, 19 - 4, 24 - 8);

  var physics = buildPhysics(engine, entity, data, 'npc');
  var graphics = buildGraphics(engine, entity, data);

  var width = document.body.clientWidth / 4;
  data.loc.x = Math.random() * width;

  var character = new Character(data, physics, graphics);

  var state = new RabbitStateMachine({
    engine: engine,
    world: world,
    character: character,
    entity: entity
  });

  physics.emitter.on('collide', function(collidable) {
    if(collidable.type === 'bullet') state.takeDamage();
  });

  engine.behavior.table.attach(entity, new NpcController(state));

  return character;
};

