!function(exports) {
  'use strict';

  var Runner = exports.Runner,
      RunQueue = exports.RunQueue,
      loop = exports.loop;

  var currentLoop;

  var engine = exports.engine = {
    root: null,
    components: [],

    next: new RunQueue,
    end: new RunQueue,

    start: function(node, tickRate) {
      var runner = new Runner(this, tickRate);

      this.root = node;

      currentLoop = currentLoop || loop.timeout(function(delta) {
        runner.run(delta, tickRate || 30);
      });

      node.init();
      currentLoop.start();
    },

    stop: function() { if(currentLoop) currentLoop.stop(); },

    switchRoot: function(root) {
      this.next.enqueue(function() {
        engine.root.destroy();
        engine.root = root;
        root.init();
      });
    }
  };

}(seine);
