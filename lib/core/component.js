!function(exports) {
  'use strict';

  var extend = exports.extend,
      RunQueue = exports.RunQueue;

  function Component() {
    this._started = false;
    this._stopped = false;
    this.init.apply(this, arguments);
  }


  Component.extend = function(methods) {
    var Derived = extend(this, methods);
    Derived.extend = this.extend;
    return Derived;
  };


  Component.prototype.init = function() {};



  /*
   * State
   * ---------------------------------------------------------------------------
   */

  Component.prototype.started = function() {
    return this._started && !this._stopped;
  };
  Component.prototype.stopped = function() {
    return this._stopped;
  };



  /*
   * Lifecycle
   * ---------------------------------------------------------------------------
   */

  Component.prototype._start = function() {
    this.start();
    this._started = true;
    this._stopped = false;
  };
  Component.prototype.start = function() {};

  Component.prototype._stop = function() {
    this.stop();
    this._stopped = true;
  };
  Component.prototype.stop = function() {};



  /*
   * Export
   * ---------------------------------------------------------------------------
   */

  exports.Component = Component;

}(compo);
