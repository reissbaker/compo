!function(seine, exports) {
  'use strict';

  var SceneNode = seine.SceneNode,
      Keylogger = demo.Keylogger;

  var World = SceneNode.extend();

  World.prototype.init = function() {
    SceneNode.prototype.init.call(this);

    this.components.push(new Keylogger);
  };

  exports.World = World;

}(seine, demo);
