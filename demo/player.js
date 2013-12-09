!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Controller = exports.NodeKeyboardController,
      PositionLogger = exports.PositionLogger,
      Graphics = exports.Graphics;

  var Player = Component.extend(function() {
    Component.call(this);

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.dir = {
      x: 1,
      y: 1
    };
  });

  Player.prototype.init = function() {
    this.push(new Controller(this));
    this.push(new PositionLogger(this));
    this.push(new Graphics(this, '/swordguy.png'));
  };

  exports.Player = Player;

}(seine, demo);
