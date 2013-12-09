!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard;

  var KEY = keyboard.key.BACKTICK,
      MOD = keyboard.key.SHIFT;

  var PositionLogger = Component.extend(function(positional) {
    Component.call(this);
    this.positional = positional;
  });

  PositionLogger.prototype.update = function() {
    var positional = this.positional;
    if(pressed()) {
      console.log([
        'position: (',
          positional.x,
        ', ',
          positional.y,
        ', ',
          positional.z,
        ')'
      ].join(''));
    }
  };

  function pressed() { return modifier() && key(); }
  function modifier() { return keyboard.down(MOD); }
  function key() { return keyboard.pressed(KEY); }

  exports.PositionLogger = PositionLogger;

}(seine, demo);
