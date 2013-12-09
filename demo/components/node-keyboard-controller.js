!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard;

  var SPEED = 100;

  var NodeKeyboardController = Component.extend({
    constructor: function(node) {
      Component.call(this);
      this.node = node;
    },
    update: function(d) {
      var node = this.node,
          delta = d / 1000;

      if(keyboard.down(keyboard.key.LEFT)) {
        node.x -= SPEED * delta;
        node.dir.x = -1;
      }
      if(keyboard.down(keyboard.key.RIGHT)) {
        node.x += SPEED * delta;
        node.dir.x = 1;
      }
      if(keyboard.down(keyboard.key.UP)) node.y -= SPEED * delta;
      if(keyboard.down(keyboard.key.DOWN)) node.y += SPEED * delta;
    }
  });


  exports.NodeKeyboardController = NodeKeyboardController;

}(seine, demo);
