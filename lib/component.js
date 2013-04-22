!function(exports) {
  'use strict';

  function Component() {}

  Component.prototype.before = stub();
  Component.prototype.update = stub();
  Component.prototype.after = stub();

  Component.prototype.preprocess = stub();
  Component.prototype.render = stub();
  Component.prototype.postprocess = stub();


  function stub() { return function(delta, x, y, z) {}; }

  /*
   * Export
   * ------
   */

  exports.Component = Component;

}(seine);
