'use strict';

import Kernel = require('../kernel');

var MAX_FRAMESKIP = 5;

class Runner {
  _elapsed: number = 0;
  _kernel: Kernel;

  constructor(kernel: Kernel) {
    this._kernel = kernel;
  }

  run(delta: number, tickRate: number) {
    var tickLength = 1000 / tickRate,
        consumed = runUpdate(this, delta, tickLength);

    if(consumed > 0) this._kernel.render(consumed);
  }
}

function runUpdate(runner: Runner, delta: number, tickLength: number) {
  var consumed = 0;
  runner._elapsed += Math.min(delta, tickLength * MAX_FRAMESKIP);

  while(runner._elapsed > tickLength) {
    runner._kernel.tick(tickLength);
    runner._elapsed -= tickLength;
    consumed += tickLength;
  }

  return consumed;
}

export = Runner;
