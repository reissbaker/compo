!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue;

  var MAX_FRAMESKIP = 5;

  function Runner(engine, tickRate) {
    this._engine = engine;
    this._elapsed = 0;
  }

  Runner.prototype.run = function(delta, tickRate) {
    var tickLength = 1000 / tickRate,
        consumed = runUpdate(this, delta, tickLength);

    if(consumed > 0) draw(this, consumed);
  };

  function runUpdate(runner, delta, tickLength) {
    var consumed = 0;
    runner._elapsed += cap(delta, tickLength * MAX_FRAMESKIP);

    while(runner._elapsed > tickLength) {
      tick(runner, tickLength);
      runner._elapsed -= tickLength;
      consumed += tickLength;
    }

    return consumed;
  }

  function cap(amount, max) {
    if(amount > max) return max;
    return amount;
  }

  function draw(runner, elapsed) {
    var engine = runner._engine;

    runBeforeEngineMethod(engine, 'preprocess', elapsed);
    runBeforeEngineMethod(engine, 'render', elapsed);
    runAfterEngineMethod(engine, 'postprocess', elapsed);
  }

  function tick(runner, tickLength) {
    var engine = runner._engine;

    fireAllNext(engine);

    runBeforeEngineMethod(engine, 'before', tickLength);
    runBeforeEngineMethod(engine, 'update', tickLength);
    runAfterEngineMethod(engine, 'after', tickLength);

    fireAllEnd(engine);
  }

  // these do the opposite of their names. awkward.
  function runBeforeEngineMethod(engine, method, time) {
    engine.components[method](time, 0, 0 , 0);
    engine.root[method](time, 0, 0, 0);
  }

  function runAfterEngineMethod(engine, method, time) {
    engine.root[method](time, 0, 0, 0);
    engine.components[method](time, 0, 0 , 0);
  }

  function each(arr, callback) {
    for(var i = 0, l = arr.length; i < l; i++) {
      callback(arr[i]);
    }
  }

  function fireAllNext(engine) {
    engine.next.fire();
    each(engine.components, fireNext);
    engine.root.next.fire();
  }

  function fireAllEnd(engine) {
    engine.root.end.fire();
    each(engine.components, fireEnd);
    engine.end.fire();
  }

  function fireNext(component) { component.next.fire(); }
  function fireEnd(component) { component.end.fire(); }

  exports.Runner = Runner;

}(seine);
