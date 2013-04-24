!function(seine, exports) {
  'use strict';

  var SceneNode = seine.SceneNode,
      Keylogger = demo.Keylogger,
      Player = demo.Player;

  var World = SceneNode.extend();

  World.prototype.init = function() {
    SceneNode.prototype.init.call(this);

    this.components.push(new Keylogger);
    this.push(new Player);
  };

  exports.World = World;

}(seine, demo);
