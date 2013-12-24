!function(seine, exports) {
  'use strict';

  var Component = seine.Component;
  exports.RandomPlacement = Component.extend({
    constructor: function(position) {
      Component.call(this);
      this.pos = position;
    },
    init: function() {
      var width = document.body.clientWidth,
          height = document.body.clientHeight;
      this.pos.x = Math.random() * width;
      this.pos.y = Math.random() * height;
    }
  });
}(seine, demo);
