!function(compo, exports) {
  'use strict';

  var Component = compo.Component;
  exports.RandomPlacement = Component.extend({
    init: function(loc) {
      this.loc = loc;
    },
    start: function() {
      var width = document.body.clientWidth;
      this.loc.x = Math.random() * width;
    }
  });
}(compo, demo);
