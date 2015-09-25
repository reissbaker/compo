'use strict';

import Kernel = require('./kernel');
import events = require('./events');
import Emitter = events.Emitter;

const TARGET_FPS = 60;
const TARGET_FRAMETIME = 1000 / TARGET_FPS;
const MIN_FRAMETIME = 10;
const MAX_FRAMESKIP = 5;

const rAF = window.requestAnimationFrame || fallback;

function fallback(callback: () => any) {
  setTimeout(callback, TARGET_FRAMETIME);
}

class Runner {
  static BEGIN_EVENT: string = 'beginFrame';
  static END_EVENT: string = 'endFrame';

  _stopped: boolean = false;
  _prevTime: number;
  _emitter: Emitter<void> = new Emitter<void>(
    Runner.BEGIN_EVENT,
    Runner.END_EVENT
  );

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

    const timestamp = (new Date).valueOf();
    runner._emitter.trigger(Runner.BEGIN_EVENT, null);
    runUpdate(runner, timestamp - runner._prevTime);
    runner._emitter.trigger(Runner.END_EVENT, null);
    runner._prevTime = timestamp;

    rAF(loop);
  }
  return loop;
}

function runUpdate(runner: Runner, delta: number) {
  let consumed = 0;
  const tickLength = runner._tickLength;

  runner._elapsed += Math.min(delta, tickLength * MAX_FRAMESKIP);

  while(runner._elapsed > tickLength) {
    runner._kernel.tick(tickLength);
    runner._elapsed -= tickLength;
    consumed += tickLength;
  }

  if(consumed > 0) runner._kernel.render(consumed);
}

export = Runner;
