!function(window) {
  'use strict';

  var oldSeine = window.seine;

  window.seine = {
    noConflict: function() {
      window.seine = oldSeine;
      return this;
    }
  };
}(window);
