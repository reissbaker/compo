!function(compo, exports) {
  'use strict';

  var Component = compo.Component,
      keyboard = demo.keyboard;

  var Keylogger = Component.extend({
    update: function(delta) {
      if(keyboard.pressed(keyboard.key.X)) console.log('x pressed');
      if(keyboard.down(keyboard.key.X))  console.log('x down');
    }
  });

  exports.Keylogger = Keylogger;

}(compo, demo);
