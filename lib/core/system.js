!function(exports) {
  'use strict';

  var extend = exports.extend,
      Component = exports.Component;

  var System = Component.extend({
    constructor: function() {
      this._startCallback = {};
      this._stopCallback = {};
      Component.apply(this, arguments);
    },
    before: function(dt) {},
    update: function(dt) {},
    after: function(dt) {},
    render: function(dt) {},
    onStart: function(name, callback) {
      this._startCallback[name] = this._startCallback[name] || [];
      this._startCallback[name].push(callback);
    },
    onStop: function(name, callback) {
      this._stopCallback[name] = this._stopCallback[name] || [];
      this._stopCallback[name].push(callback);
    }
  });


  /*
   * System Definition
   * ---------------------------------------------------------------------------
   */

  System.extend = function(obj) {
    var SystemClass, prop,
        registers = obj.observe;
    delete obj.observe;

    createRegistrationConstructor(obj, registers);
    SystemClass = extend(System, obj);

    return SystemClass;
  };

  function createRegistrationConstructor(methods, observed) {
    var oldConstructor;
    if(methods.hasOwnProperty('constructor')) {
      oldConstructor = methods.constructor;
    } else {
      oldConstructor = System;
    }

    methods.constructor = function() {
      this.observe = {};

      for(var prop in observed) {
        if(observed.hasOwnProperty(prop)) {
          this.observe[prop] = [];
          defineRegistration(this, prop, observed[prop]);
        }
      }
      oldConstructor.apply(this, arguments);
    };
  }

  function defineRegistration(system, name, Component) {
    var oldStart = Component.prototype._start,
        oldStop = Component.prototype._stop;

    Component.prototype._start = function() {
      register(this, system, name);
      oldStart.call(this);
    };

    Component.prototype._stop = function() {
      unregister(this, system, name);
      oldStop.call(this);
    };
  }

  function register(component, system, name) {
    system.observe[name].push(component);
    var callback = system._startCallback[name];
    if(callback) runCallbacks(callback, component);
  }

  function unregister(component, system, name) {
    var i, l, curr, callback,
        observation = system.observe[name];

    for(i = 0, l = system[name].length; i < l; i++) {
      curr = observation[i];
      if(curr === this) {
        observation.splice(i, 1);
        callback = system._stopCallback[name];
        if(callback) runCallbacks(callback, curr);
        break;
      }
    }
  }

  function runCallbacks(cbs, component) {
    cbs.forEach(function(cb) { cb(component); });
  }

  exports.System = System;

}(seine);
