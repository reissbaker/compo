!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Controller = exports.NodeKeyboardController,
      PositionLogger = exports.PositionLogger,
      Graphics = exports.Graphics,
      Direction = exports.Direction,
      Rect = exports.Rect,
      TilePhysicsComponent = exports.TilePhysicsComponent;

  var MAX_VEL = 200,
      DRAG = 5000,
      GRAVITY = 1000;

  var Player = Component.extend({
    constructor: function() {
      Component.call(this);

      this.hitbox = new Rect(0, 0, 48, 32);
      this.dir = new Direction;
    },
    init: function() {
      var physics = new TilePhysicsComponent(this.hitbox);
      physics.gravity.y = GRAVITY;
      physics.maxVelocity.x = MAX_VEL;
      physics.maxVelocity.y = MAX_VEL;
      physics.drag.x = DRAG;
      physics.drag.y = DRAG;
      this.push(physics);
      this.push(new Controller(this.dir, physics));

      this.push(new PositionLogger(this));
      this.push(new Graphics(this.hitbox, this.dir, '/assets/swordguy.png', {
        x: 0, y: 0, width: 48, height: 32
      }));
    }
  });


  exports.Player = Player;

}(seine, demo);
