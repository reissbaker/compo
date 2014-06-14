'use strict';

var TARGET_FPS = 60,
    TARGET_FRAMETIME = 1000 / TARGET_FPS,
    MIN_FRAMETIME = 10;

var rAF = window.requestAnimationFrame || fallback;

function fallback(callback: () => any) {
  setTimeout(callback, TARGET_FRAMETIME);
}

class Looper {
  _stopped: boolean = false;
  _prevTime: number;
  _runFn: (delta: number) => void;

  constructor(runFn: (delta: number) => void) {
    this._runFn = runFn;
  }

  start() {
    this._stopped = false;
    this._prevTime = (new Date()).valueOf();
    rAF(onTick(this));
  }

  stop() {
    this._stopped = true;
  }
}

// TODO: Danger Will Robinson: this loop might accidentally start firing twice,
// if you call start() and stop() in quick succession. rAF could fire off a
// second loop, and by the time the first one comes back it'll no longer be
// stopped.
function onTick(looper: Looper) {
  function loop() {
    if(looper._stopped) return;

    var timestamp = (new Date).valueOf(),
        delta = timestamp - looper._prevTime;

    looper._prevTime = timestamp;

    looper._runFn(delta);
    rAF(loop);
  }
  return loop;
}

export = Looper;
