!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Controller = exports.NodeKeyboardController,
      PositionLogger = exports.PositionLogger,
      Graphics = exports.Graphics,
      Direction = exports.Direction,
      Rect = exports.Rect,
      TilePhysicsComponent = exports.TilePhysicsComponent,
      constants = exports.constants;

  var Player = Component.extend({
    constructor: function() {
      Component.call(this);

      this.hitbox = new Rect(0, 0, 48, 32);
      this.dir = new Direction;
    },
    init: function() {
      var physics = new TilePhysicsComponent(this.hitbox);
      physics.gravity.y = constants.GRAVITY;
      physics.maxVelocity.x = constants.MAX_X_VEL;
      physics.maxVelocity.y = constants.MAX_Y_VEL;
      physics.drag.x = constants.DRAG;
      physics.drag.y = constants.DRAG;
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
