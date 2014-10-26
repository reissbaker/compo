'use strict';

var Tile = require('../../physics/tile');

var MAX_X_VEL = 400,
    MAX_Y_VEL = MAX_X_VEL;

module.exports = function(engine, entity, data, type) {
  var tilePhysics = new Tile(data.loc, data.hitbox, type);
  engine.physics.restrictCollisions('bullet', ['npc']);
  engine.physics.tiles.attach(entity, tilePhysics);

  tilePhysics.maxVelocity.y = MAX_Y_VEL;
  tilePhysics.maxVelocity.x = MAX_X_VEL;

  return tilePhysics;
};

exports.SHOOT_SPEED = MAX_X_VEL;
