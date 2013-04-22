!function(seine, exports) {
  'use strict';

  var SceneNode = seine.SceneNode;

  var World = SceneNode.extend();

  World.prototype.init = function() {
    SceneNode.prototype.init.call(this);
  };

  exports.World = World;

}(seine, demo);
