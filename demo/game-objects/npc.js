!function(compo, exports) {
  'use strict';

  var component = compo.component,
      GameObject = exports.GameObject,
      RandomPlacement = exports.RandomPlacement,
      swordguy = exports.decorators.swordguy;

  exports.NPC = component.extend(GameObject, {
    constructor: function() {
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
}(compo, demo);
