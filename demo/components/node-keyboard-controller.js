!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard,
      constants = exports.constants;

  var NodeKeyboardController = Component.extend({
    constructor: function(dir, physics) {
      Component.call(this);
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
