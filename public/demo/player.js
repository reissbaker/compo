!function(seine, exports) {
  'use strict';

  var SceneNode = seine.SceneNode,
      Controller = demo.NodeKeyboardController,
      PositionLogger = demo.PositionLogger;

  var Player = SceneNode.extend();

  Player.prototype.enter = function() {
    this.components.push(new Controller(this));
    this.components.push(new PositionLogger(this));
  };

  exports.Player = Player;

}(seine, demo);
