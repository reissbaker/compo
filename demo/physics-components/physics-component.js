!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Point = exports.Point;

  var PhysicsComponent = Component.extend({
    init: function(loc, hitbox) {
      this.loc = loc;
      this.hitbox = hitbox;

      this.velocity = new Point;
      this.maxVelocity = new Point;
      this.acceleration = new Point;
      this.drag = new Point;
      this.gravity = new Point;

      this.immovable = false;
    }
  });


  exports.TilePhysicsComponent = PhysicsComponent;

}(seine, demo);
