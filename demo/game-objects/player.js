!function(seine, exports) {
  'use strict';

  var GameObject = exports.GameObject,
      Controller = exports.NodeKeyboardController,
      PositionLogger = exports.PositionLogger,
      Graphics = exports.Graphics,
      TilePhysicsComponent = exports.TilePhysicsComponent,
      constants = exports.constants;

  var Player = GameObject.extend({
    constructor: function() {
      GameObject.call(this, 0, 0, 48, 32);
    },
    init: function() {
      var physics = new TilePhysicsComponent(this.loc, this.hitbox);
      physics.gravity.y = constants.GRAVITY;
      physics.maxVelocity.x = constants.MAX_X_VEL;
      physics.maxVelocity.y = constants.MAX_Y_VEL;
      physics.drag.x = constants.DRAG;
      physics.drag.y = constants.DRAG;
      this.push(physics);
      this.push(new Controller(this.dir, physics));

      this.push(new PositionLogger(this));
      this.push(new Graphics(this.loc, this.dir, '/assets/swordguy.png', {
        x: 0, y: 0, width: 48, height: 32
      }));
    }
  });


  exports.Player = Player;

}(seine, demo);
