!function(exports) {
  'use strict';

  var MAX_FRAMESKIP = 5;

  function Runner(kernel) {
    this._kernel = kernel;
    this._elapsed = 0;
  }

  Runner.prototype.run = function(delta, tickRate) {
    var tickLength = 1000 / tickRate,
        consumed = runUpdate(this, delta, tickLength);

    if(consumed > 0) this._kernel.draw(consumed);
  };

  function runUpdate(runner, delta, tickLength) {
    var consumed = 0;
    runner._elapsed += cap(delta, tickLength * MAX_FRAMESKIP);

    while(runner._elapsed > tickLength) {
      runner._kernel.tick(tickLength);
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

}(compo);
