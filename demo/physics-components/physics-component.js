!function(compo, exports) {
  'use strict';

  var Component = compo.Component,
      Point = exports.Point,
      Collidable = exports.Collidable;

  var PhysicsComponent = Component.extend({
    init: function(loc, hitbox) {
      this.collidable = new Collidable(loc, hitbox);

      this.velocity = new Point;
      this.maxVelocity = new Point;
      this.acceleration = new Point;
      this.drag = new Point;
      this.gravity = new Point;

      this.immovable = false;
    }
  });


  exports.TilePhysicsComponent = PhysicsComponent;

}(compo, demo);
