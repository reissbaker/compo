'use strict';

var GameData = require('../shared/game-data'),
    Bullet = require('./bullet'),
    buildGraphics = require('./animation'),
    buildPhysics = require('./physics');

var pool = [];

exports.build = function(engine, world) {
  if(pool.length > 0) return revive(engine, world, pool.pop());
  return create(engine, world);
};

function create(engine, world) {
  var entity = world.entity();
  var data = new GameData(0, 0, 0, 0, 5, 5);

  var graphics = buildGraphics(engine, entity, data);
  var physics = buildPhysics(engine, entity, data, 'bullet');

  physics.emitter.on('collide', function() {
    engine.kernel.db.destroy(entity);
  });

  return new Bullet(data, physics, graphics);
}

function revive(engine, world, deadBullet) {
  return deadBullet;
}

exports.recycle = function(engine, entity, bullet) {
  engine.renderer.table.detach(entity, bullet.graphics);
  engine.physics.tiles.detach(entity, bullet.physics);

  pool.push(bullet);
};

// Hm. Does this imply that factories should be instantiated?
exports.reset = function() {
  pool = [];
};
