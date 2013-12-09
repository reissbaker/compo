!function(exports) {
  'use strict';

  var RunQueue = exports.RunQueue;

  var MAX_FRAMESKIP = 5;

  function Runner(engine) {
    this._engine = engine;
    this._elapsed = 0;
  }

  Runner.prototype.run = function(delta, tickRate) {
    var tickLength = 1000 / tickRate,
        consumed = runUpdate(this, delta, tickLength);

    if(consumed > 0) this._engine.draw(consumed);
  };

  function runUpdate(runner, delta, tickLength) {
    var consumed = 0;
    runner._elapsed += cap(delta, tickLength * MAX_FRAMESKIP);

    while(runner._elapsed > tickLength) {
      runner._engine.tick(tickLength);
      runner._elapsed -= tickLength;
      consumed += tickLength;
    }

    return consumed;
  }

  function cap(amount, max) {
    if(amount > max) return max;
    return amount;
  }

  exports.Runner = Runner;

}(seine);
