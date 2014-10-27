'use strict';

var GameData = require('../shared/game-data'),
    Bullet = require('./bullet'),
    ObjectController = require('../../behavior/object-controller'),
    BulletStateMachine = require('./state/machine'),
    buildGraphics = require('./animation'),
    buildPhysics = require('./physics');

module.exports = function(engine, world) {
  var entity = world.entity();
  var data = new GameData(0, 0, 0, 0, 8, 5);

  var graphics = buildGraphics(engine, entity, data);
  var physics = buildPhysics(engine, entity, data, 'bullet');


  var bullet = new Bullet(data, physics, graphics);
  var state = new BulletStateMachine({
    engine: engine,
    world: world,
    bullet: bullet,
    entity: entity
  });

  physics.emitter.on('collide', function() { state.collide(); });

  engine.behavior.table.attach(entity, new ObjectController(state));

  return bullet;
}
