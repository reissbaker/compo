'use strict';

var physics = require('../../physics/system'),
    Tile = require('../../physics/tile'),
    TileGraphic = require('../../graphics/tile-graphic'),
    renderer = require('../../graphics/renderer');

var url = '/assets/swordguy.png',
    MAX_X_VEL = 10000,
    MAX_Y_VEL = 15000,
    GRAVITY = 1900,
    DRAG = 3000;

module.exports = function(gameObject) {
  var tilePhysics = new Tile(gameObject.loc, gameObject.hitbox);
  physics.tiles.attach(gameObject.entity, tilePhysics);
  tilePhysics.gravity.y = GRAVITY;
  tilePhysics.maxVelocity.y = MAX_Y_VEL;
  tilePhysics.drag.x = DRAG;
  tilePhysics.maxVelocity.x = MAX_X_VEL;

  var graphics = new TileGraphic(gameObject.loc, gameObject.dir, url, {
    x: 0, y: 0, width: 48, height: 32
  });
  renderer.table.attach(gameObject.entity, graphics);

  return {
    physics: tilePhysics,
    graphics: graphics
  };
};
