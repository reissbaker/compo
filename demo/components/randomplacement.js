!function(seine, exports) {
  'use strict';

  var Component = seine.Component;
  exports.RandomPlacement = Component.extend({
    constructor: function(node) {
      Component.call(this);
      this.node = node;
    },
    init: function() {
      var width = document.body.clientWidth,
          height = document.body.clientHeight;
      this.node.x = Math.random() * width;
      this.node.y = Math.random() * height;
    }
  });
}(seine, demo);
