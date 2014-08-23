'use strict';

var Tile = require('../../physics/tile');

var MAX_X_VEL = 8000,
    MAX_Y_VEL = 12000,
    GRAVITY = 1600,
    DRAG = 3000;

module.exports = function(engine, entity, data) {
  var tilePhysics = new Tile(data.loc, data.hitbox);
  engine.physics.tiles.attach(entity, tilePhysics);

  tilePhysics.gravity.y = GRAVITY;
  tilePhysics.maxVelocity.y = MAX_Y_VEL;
  tilePhysics.drag.x = DRAG;
  tilePhysics.maxVelocity.x = MAX_X_VEL;

  return tilePhysics;
}
