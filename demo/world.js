!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Keylogger = demo.Keylogger,
      Player = demo.Player,
      NPC = demo.NPC;

  var World = Component.extend({
    init: function() {
      this.push(new Keylogger);
      for(var i = 0; i < 20; i++) {
        this.push(new NPC);
      }
      this.push(new Player);
    }
  });

  exports.World = World;

}(seine, demo);
