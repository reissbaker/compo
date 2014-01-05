!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue,
      Runner = exports.Runner,
      loop = exports.loop,
      Component = exports.Component,
      Entity = exports.Entity,
      BehaviorSystem = exports.BehaviorSystem;

  var DEFAULT_TICKRATE = 30;

  exports.Kernel = Component.extend({
    init: function(tickRate) {
      var runner = new Runner(this);

      if(!tickRate) tickRate = DEFAULT_TICKRATE;

      this.next = new RunQueue;
      this.end = new RunQueue;

      this._systems = [];
      this._systemRegistry = [];
      this._container = null;
      this._root = null;

      this._loop = loop.timeout(function(delta) {
        runner.run(delta, tickRate);
      });

      // Auto-register behavior system.
      this.register(new BehaviorSystem);
    },


    /*
     * Lifecycle
     * -------------------------------------------------------------------------
     */

    start: function(root) {
      this._container = new Entity;
      this._root = root;
      this._container.push(root);
      this._systems.forEach(function(s) { s._start(); });
      this._container._start();
      this._loop.start();
    },

    stop: function() {
      this._loop.stop();
      this._container._stop();
      this._systems.forEach(function(s) { s._stop(); });
    },

    pause: function() { this._loop.pause(); },
    unpause: function() { this._loop.start(); },


    /*
     * Root Entity
     * -------------------------------------------------------------------------
     */

    root: function() { return this._root; },
    switchRoot: function(NewRootClass, options) {
      var that = this;
      this.next.enqueue(function() {
        if(that._root) that._container.remove(that._root);
        that._root = new NewRootClass(that, options || {});
        that._container.push(that._root);
      });
    },


    /*
     * System Registration
     * -------------------------------------------------------------------------
     */

    register: function(system) {
      this._systems.push(system);
    },

    unregister: function(target) {
      var i, l, curr;

      for(i = 0, l = this._systems.length; i < l; i++) {
        curr = this._systems[i];
        if(curr === target) {
          this._systems.splice(i, 1);
          return true;
        }
      }

      return false;
    },

    system: function(SystemClass) {
      var curr, i, l;
      for(var i = 0, l = this._systems.length; i < l; i++) {
        curr = this._systems[i];
        if(curr instanceof SystemClass) return curr;
      }
      return null;
    },


    /*
     * Runloop Callbacks
     * -------------------------------------------------------------------------
     */

    tick: function(dt) {
      var sys = this._systems;
      this.next.fire();
      sys.forEach(function(s) { s.before(dt); });
      sys.forEach(function(s) { s.update(dt); });
      sys.forEach(function(s) { s.after(dt); });
      this.end.fire();
    },

    draw: function(dt) {
      this._systems.forEach(function(s) { s.render(dt); });
    }
  });

}(compo);
