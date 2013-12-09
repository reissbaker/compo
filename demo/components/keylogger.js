!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard;

  var Keylogger = Component.extend();
  Keylogger.prototype.update = function(delta) {
    if(keyboard.pressed(keyboard.key.X)) console.log('x pressed');
    if(keyboard.down(keyboard.key.X))  console.log('x down');
  };

  exports.Keylogger = Keylogger;

}(seine, demo);
