!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard;

  var PositionLogger = Component.extend();

  PositionLogger.prototype.update = function(delta, x, y, z) {
    if(keyboard.pressed(keyboard.key.BACKTICK)) {
      console.log('position: (' + x + ', ' + y + ', ' + z + ')');
    }
  };

  exports.PositionLogger = PositionLogger;

}(seine, demo);
