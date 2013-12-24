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
    overlay: new Component,

    /*
     * Lifecycle
     * -------------------------------------------------------------------------
     */

    init: function(node, tickRate) {
      var runner = new Runner(engine),
          tick = tickRate || 30;

      kernel = new Kernel(node, engine.overlay);
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
    switchScene: function(newRoot) { kernel.switchScene(newRoot); },


    /*
     * Update State
     * -------------------------------------------------------------------------
     */

    tick: function(delta) {
      dfsAll(engine.before, kernel, engine.after, delta, tick);
    },

    draw: function(delta) {
      dfsAll(engine.before, kernel, engine.after, delta, draw);
    }
  };


  /*
   * Helpers
   * ---------------------------------------------------------------------------
   */

  function dfsAll(before, kernel, after, delta, callback) {
    dfs(before, delta, callback);
    dfs(kernel, delta, callback);
    dfs(after, delta, callback);
  }

  function tick(component, delta) {
    component.next.fire();
    component.update(delta);
    component.end.fire();
  }

  function draw(component, delta) {
    component.preprocess(delta);
    component.render(delta);
    component.postprocess(delta);
  }

  function dfs(tree, delta, callback) {
    tree._node.each(function(node) {
      callback(node.data, delta);
    });
  }

  /*
   * Export
   * ---------------------------------------------------------------------------
   */

  exports.engine = engine;

}(seine);
