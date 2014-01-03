!function(seine, exports) {
  'use strict';

  var GameObject = exports.GameObject,
      RandomPlacement = exports.RandomPlacement,
      swordguy = exports.decorators.swordguy;

  exports.NPC = GameObject.extend({
    constructor: function(kernel) {
      GameObject.call(this, 0, 0, 48, 32);
    },
    start: function() {
      this.decorate(swordguy, {
        loc: this.loc,
        dir: this.dir,
        hitbox: this.hitbox
      });

      this.push(new RandomPlacement(this.loc));
    }
  });
}(seine, demo);
