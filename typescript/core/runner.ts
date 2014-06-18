'use strict';

import Kernel = require('./kernel');
import events = require('./events');
import Emitter = events.Emitter;

var TARGET_FPS = 60,
    TARGET_FRAMETIME = 1000 / TARGET_FPS,
    MIN_FRAMETIME = 10,
    MAX_FRAMESKIP = 5,
    BEGIN_EVENT = 'beginFrame',
    END_EVENT = 'endFrame';

var rAF = window.requestAnimationFrame || fallback;

function fallback(callback: () => any) {
  setTimeout(callback, TARGET_FRAMETIME);
}

class Runner {
  _stopped: boolean = false;
  _prevTime: number;
  _emitter: Emitter<void> = new Emitter<void>(BEGIN_EVENT, END_EVENT);

  _elapsed: number = 0;

  _tickLength: number;
  _kernel: Kernel;

  constructor(kernel: Kernel, tickRate: number) {
    this._kernel = kernel;
    this._tickLength = 1000 / tickRate;
  }

  start() {
    this._stopped = false;
    this._prevTime = (new Date()).valueOf();
    rAF(onTick(this));
  }

  stop() {
    this._stopped = true;
  }

  on(event: string, callback: () => void) {
    this._emitter.on(event, callback);
  }

  off(event: string, callback: () => void) {
    this._emitter.off(event, callback);
  }
}

// TODO: Danger Will Robinson: this loop might accidentally start firing twice,
// if you call start() and stop() in quick succession. rAF could fire off a
// second loop, and by the time the first one comes back it'll no longer be
// stopped.
function onTick(runner: Runner) {
  function loop() {
    if(runner._stopped) return;

    var timestamp = (new Date).valueOf();
    runner._emitter.trigger(BEGIN_EVENT, null);
    runUpdate(runner, timestamp - runner._prevTime);
    runner._emitter.trigger(END_EVENT, null);
    runner._prevTime = timestamp;

    rAF(loop);
  }
  return loop;
}

function runUpdate(runner: Runner, delta: number) {
  var consumed = 0,
      tickLength = runner._tickLength;

  runner._elapsed += Math.min(delta, tickLength * MAX_FRAMESKIP);

  while(runner._elapsed > tickLength) {
    runner._kernel.tick(tickLength);
    runner._elapsed -= tickLength;
    consumed += tickLength;
  }

  if(consumed > 0) runner._kernel.render(consumed);
}

export = Runner;
