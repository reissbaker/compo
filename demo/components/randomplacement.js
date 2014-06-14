!function(compo, exports) {
  'use strict';

  var component = compo.component;

  exports.RandomPlacement = component.define({
    init: function(loc) {
      this.loc = loc;
    },
    start: function() {
      var width = document.body.clientWidth;
      this.loc.x = Math.random() * width;
    }
  });

}(compo, demo);
