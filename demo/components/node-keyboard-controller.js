!function(seine, exports) {
  'use strict';

  var Component = seine.Component,
      keyboard = demo.keyboard;

  var NodeKeyboardController = Component.extend(function(node) {
    Component.call(this);
    this.node = node;
  });

  NodeKeyboardController.prototype.update = function(delta) {
    var node = this.node;
    if(keyboard.down(keyboard.key.LEFT)) {
      node.x -= 5 * delta / 1000;
    }
    if(keyboard.down(keyboard.key.RIGHT)) {
      node.x += 5 * delta / 1000;
    }
  };

  exports.NodeKeyboardController = NodeKeyboardController;

}(seine, demo);
