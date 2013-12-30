!function(seine, exports) {
  'use strict';

  var tilePhysics = exports.tilePhysics,
      Component = seine.Component,
      Point = exports.Point;

  var PhysicsComponent = Component.extend({
    constructor: function(loc, hitbox) {
      Component.call(this);

      this.loc = loc;
      this.hitbox = hitbox;

      this.velocity = new Point;
      this.maxVelocity = new Point;
      this.acceleration = new Point;
      this.drag = new Point;
      this.gravity = new Point;

      this.immovable = false;
    },

    init: function() { tilePhysics.register(this); },
    destroy: function() { tilePhysics.unregister(this); }
  });


  exports.TilePhysicsComponent = PhysicsComponent;

}(seine, demo);
