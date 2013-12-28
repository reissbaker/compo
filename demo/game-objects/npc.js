!function(seine, exports) {
  'use strict';

  var Direction = exports.Direction,
      Component = seine.Component,
      Graphics = exports.Graphics,
      Rect = exports.Rect,
      RandomPlacement = exports.RandomPlacement,
      TilePhysicsComponent = exports.TilePhysicsComponent,
      constants = exports.constants;

  exports.NPC = Component.extend({
    constructor: function() {
      Component.call(this);
      this.hitbox = new Rect(0, 0, 48, 32);
      this.dir = new Direction;
    },
    init: function() {
      var physics = new TilePhysicsComponent(this.hitbox);
      physics.maxVelocity.x = constants.MAX_X_VEL;
      physics.maxVelocity.y = constants.MAX_Y_VEL;
      physics.drag.x = constants.DRAG;
      physics.drag.y = constants.DRAG;
      physics.gravity.y = constants.GRAVITY;
      this.push(physics);

      this.push(new RandomPlacement(this.hitbox));
      this.push(new Graphics(this.hitbox, this.dir, '/assets/swordguy.png', {
        x: 0, y: 0, width: 48, height: 32
      }));
    }
  });
}(seine, demo);
