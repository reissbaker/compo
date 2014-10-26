'use strict';

var Tile = require('../../physics/tile');

var MAX_X_VEL = 250,
    MAX_Y_VEL = 350,
    GRAVITY = 1600,
    DRAG = 3000;

module.exports = function(engine, entity, data, type) {
  var tilePhysics = new Tile(data.loc, data.hitbox, type);
  engine.physics.tiles.attach(entity, tilePhysics);

  tilePhysics.gravity.y = GRAVITY;
  tilePhysics.maxVelocity.y = MAX_Y_VEL;
  tilePhysics.drag.x = DRAG;
  tilePhysics.maxVelocity.x = MAX_X_VEL;

  return tilePhysics;
};
