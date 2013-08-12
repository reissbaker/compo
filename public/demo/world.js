!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Keylogger = demo.Keylogger,
      Player = demo.Player;

  var World = Component.extend();

  World.prototype.init = function() {
    this.unshift(new Keylogger);
    this.push(new Player);
  };

  exports.World = World;

}(seine, demo);
