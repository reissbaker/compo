!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard;

  var KEY = keyboard.key.BACKTICK,
      MOD = keyboard.key.SHIFT;

  var PositionLogger = Component.extend();

  PositionLogger.prototype.update = function(delta, x, y, z) {
    if(modifier() && pressed()) {
      console.log('position: (' + x + ', ' + y + ', ' + z + ')');
    }
  };

  function modifier() { return keyboard.down(MOD); }
  function pressed() { return keyboard.pressed(KEY); }

  exports.PositionLogger = PositionLogger;

}(seine, demo);
