!function(exports) {
  'use strict';

  var Runner = exports.Runner,
      loop = exports.loop,
      Component = exports.Component,
      Kernel = exports.Kernel;

  var currentLoop = null,
      kernel = null;

  exports.engine = {
    component: new Component,

    /*
     * Lifecycle
     * -------------------------------------------------------------------------
     */

    init: function(node, tickRate) {
      var runner = new Runner(this),
          tick = tickRate || 30,
          that = this;

      kernel = new Kernel(node, this.component);
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
      this.component = new Component;
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
      kernel._next();
      kernel._before();
      kernel._update();
      kernel._after();
      kernel._end();
    },
    draw: function() {
      kernel._preprocess();
      kernel._render();
      kernel._postprocess();
    }
  };
}(seine);
