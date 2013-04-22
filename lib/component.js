!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue;

  function Component() {
    this.next = new RunQueue;
    this.end = new RunQueue;
    this.init = new RunQueue;
    this.destroy = new RunQueue;
    this.initialized = false;
    this.destroyed = false;
  }

  Component.extend = function(constructorFn) {
    constructorFn.prototype = new Component;
    constructorFn.prototype.constructor = constructorFn;
    constructorFn.prototype.proto = constructorFn.prototype;
    return constructorFn;
  }

  Component.prototype.begin = function() {
    this.initialized = true;
    this.destroy.immediate = false;
    this.init.fire();
    this.init.immediate = true;
  };

  Component.prototype.finish = function() {
    this.destroyed = true;
    this.init.immediate = false;
    this.destroy.fire();
    this.destroy.immediate = true;
  };

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
