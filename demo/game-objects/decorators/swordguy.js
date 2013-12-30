!function(exports) {
  'use strict';

  exports.decorators = exports.decorators || {};
  var TilePhysicsComponent = exports.TilePhysicsComponent,
      Graphics = exports.Graphics,
      constants = exports.constants;

  exports.decorators.swordguy = function(opts) {
    var physics, graphics;

    physics = new TilePhysicsComponent(opts.loc, opts.hitbox);
    physics.maxVelocity.x = constants.MAX_X_VEL;
    physics.maxVelocity.y = constants.MAX_Y_VEL;
    physics.drag.x = constants.DRAG;
    physics.drag.y = constants.DRAG;
    physics.gravity.y = constants.GRAVITY;

    graphics = new Graphics(opts.loc, opts.dir, '/assets/swordguy.png', {
      x: 0, y: 0, width: 48, height: 32
    });

    return {
      physics: physics,
      graphics: graphics
    };
  };

}(demo);
