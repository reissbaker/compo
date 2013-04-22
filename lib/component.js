!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue;

  function Component() {
    this.next = new RunQueue;
    this.end = new RunQueue;
  }

  Component.extend = function(constructorFn) {
    var prop, scope = this;
    if(!constructorFn) constructorFn = function() { scope.call(this); };

    constructorFn.prototype = new Component;
    constructorFn.prototype.constructor = constructorFn;
    constructorFn.prototype.proto = constructorFn.prototype;

    for(prop in scope) {
      if(scope.hasOwnProperty(prop)) constructorFn[prop] = scope[prop];
    }

    return constructorFn;
  }

  Component.prototype.init = stub();
  Component.prototype.destroy = stub();

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
