!function(exports) {
  'use strict';

  var Runner = exports.Runner,
      loop = exports.loop,
      Component = exports.Component,
      Kernel = exports.Kernel;

  var currentLoop = null,
      kernel = null;

  var engine = {
    before: new Component,
    after: new Component,
    around: function(obj) {
      engine.before.unshift(obj.before);
      engine.after.push(obj.after);
    },

    /*
     * Lifecycle
     * -------------------------------------------------------------------------
     */

    init: function(node, tickRate) {
      var runner = new Runner(engine),
          tick = tickRate || 30;

      kernel = new Kernel(node, engine.component);
      kernel._init();
      loop = loop.timeout(function(delta) {
        runner.run(delta, tick);
      });
      loop.start();
    },
    destroy: function() {
      loop.stop();
      kernel._destroy();

      kernel = null;
      loop = null;
      engine.component = new Component;
    },


    /*
     * Engine Loop
     * -------------------------------------------------------------------------
     */

    pause: function() { loop.stop(); },
    unpause: function() { loop.start(); },


    /*
     * Kernel Root
     * -------------------------------------------------------------------------
     */

    root: function() { return kernel.root; },
    switchRoot: function(newRoot) { kernel.switchRoot(newRoot); },


    /*
     * Update State
     * -------------------------------------------------------------------------
     */

    tick: function() {
      interleaveAll(engine.before, kernel, engine.after, [
        '_next',
        '_before',
        '_update',
        '_after',
        '_end'
      ]);
    },

    draw: function() {
      interleaveAll(engine.before, kernel, engine.after, [
        '_preprocess',
        '_render',
        '_postprocess'
      ]);
    }
  };


  /*
   * Helpers
   * ---------------------------------------------------------------------------
   */

  function interleaveAll(before, mid, after, methods) {
    for(var i = 0, l = methods.length; i < l; i++) {
      interleave(before, mid, after, methods[i]);
    }
  }

  function interleave(before, mid, after, method) {
    before[method]();
    mid[method]();
    after[method]();
  }


  /*
   * Export
   * ---------------------------------------------------------------------------
   */

  exports.engine = engine;

}(seine);
