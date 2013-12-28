!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard;

  var ACCEL = 1000;

  var NodeKeyboardController = Component.extend({
    constructor: function(dir, physics) {
      Component.call(this);
      this.physics = physics;
      this.dir = dir;
    },
    update: function() {
      var physics = this.physics;

      if(keyboard.down(keyboard.key.LEFT)) {
        physics.acceleration.x = -ACCEL;
        this.dir.x = -1;
      } else if(keyboard.down(keyboard.key.RIGHT)) {
        physics.acceleration.x = ACCEL;
        this.dir.x = 1;
      } else {
        physics.acceleration.x = 0;
      }

      if(keyboard.down(keyboard.key.UP)) physics.acceleration.y = -ACCEL - 1000;
      else physics.acceleration.y = 0;
    }
  });


  exports.NodeKeyboardController = NodeKeyboardController;

}(seine, demo);
