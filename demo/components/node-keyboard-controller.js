!function(seine, exports) {
  'use strict';

  var Behavior = seine.Behavior,
      keyboard = demo.keyboard,
      constants = exports.constants;

  var NodeKeyboardController = Behavior.extend({
    init: function(dir, physics) {
      this.physics = physics;
      this.dir = dir;
    },
    update: function() {
      var physics = this.physics;

      if(keyboard.down(keyboard.key.LEFT)) {
        physics.acceleration.x = -constants.ACCEL;
        this.dir.x = -1;
      } else if(keyboard.down(keyboard.key.RIGHT)) {
        physics.acceleration.x = constants.ACCEL;
        this.dir.x = 1;
      } else {
        physics.acceleration.x = 0;
      }

      if(keyboard.pressed(keyboard.key.UP)) {
        physics.velocity.y = -constants.JUMP_POWER;
      }
    }
  });


  exports.NodeKeyboardController = NodeKeyboardController;

}(seine, demo);
