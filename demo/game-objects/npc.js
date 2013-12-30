!function(seine, exports) {
  'use strict';

  var GameObject = exports.GameObject,
      Graphics = exports.Graphics,
      RandomPlacement = exports.RandomPlacement,
      TilePhysicsComponent = exports.TilePhysicsComponent,
      constants = exports.constants;

  exports.NPC = GameObject.extend({
    constructor: function() {
      GameObject.call(this, 0, 0, 48, 32);
    },
    init: function() {
      var physics = new TilePhysicsComponent(this.loc, this.hitbox);
      physics.maxVelocity.x = constants.MAX_X_VEL;
      physics.maxVelocity.y = constants.MAX_Y_VEL;
      physics.drag.x = constants.DRAG;
      physics.drag.y = constants.DRAG;
      physics.gravity.y = constants.GRAVITY;
      this.push(physics);

      this.push(new RandomPlacement(this.loc));
      this.push(new Graphics(this.loc, this.dir, '/assets/swordguy.png', {
        x: 0, y: 0, width: 48, height: 32
      }));
    }
  });
}(seine, demo);
