!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      Controller = demo.NodeKeyboardController,
      PositionLogger = demo.PositionLogger;

  var Player = Component.extend(function() {
    Component.call(this);

    this.x = 0;
    this.y = 0;
    this.z = 0;
  });

  Player.prototype.init = function() {
    this.push(new Controller(this));
    this.push(new PositionLogger(this));
  };

  exports.Player = Player;

}(seine, demo);
