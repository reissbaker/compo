!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Graphics = exports.Graphics,
      RandomPlacement = exports.RandomPlacement;

  exports.NPC = Component.extend({
    constructor: function() {
      Component.call(this);
      this.x = this.y = this.z = 0;
      this.dir = {
        x: 1,
        y: 1
      };
    },
    init: function() {
      this.push(new RandomPlacement(this));
      this.push(new Graphics(this, '/swordguy.png'));
    }
  });
}(seine, demo);
