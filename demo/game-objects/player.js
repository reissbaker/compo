!function(seine, exports) {
  'use strict';

  var GameObject = exports.GameObject,
      Controller = exports.NodeKeyboardController,
      swordguy = exports.decorators.swordguy;

  var Player = GameObject.extend({
    constructor: function() {
      GameObject.call(this, 0, 0, 48, 32);
    },
    start: function() {
      var swordguyComponents = this.decorate(swordguy, {
        loc: this.loc,
        dir: this.dir,
        hitbox: this.hitbox
      });

      this.push(new Controller(this.dir, swordguyComponents.physics));
    }
  });


  exports.Player = Player;

}(seine, demo);
