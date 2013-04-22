!function(seine, exports) {
  'use strict';

  var SceneNode = seine.SceneNode;

  var World = SceneNode.extend();
  World.prototype.init = function() {
    console.log('hi');
  };

  exports.World = World;

}(seine, demo);
