!function(window) {
  'use strict';

  var oldCompo = window.compo;

  window.compo = {
    noConflict: function() {
      window.compo = oldCompo;
      return this;
    }
  };
}(window);
