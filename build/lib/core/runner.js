'use strict';
var events = require('./events');
var Emitter = events.Emitter;
var TARGET_FPS = 60;
var TARGET_FRAMETIME = 1000 / TARGET_FPS;
var MIN_FRAMETIME = 10;
var MAX_FRAMESKIP = 5;
var rAF = window.requestAnimationFrame || fallback;
function fallback(callback) {
    setTimeout(callback, TARGET_FRAMETIME);
}
var Runner = (function () {
    function Runner(kernel, tickRate) {
        this._stopped = false;
        this._emitter = new Emitter(Runner.BEGIN_EVENT, Runner.END_EVENT);
        this._elapsed = 0;
        this._kernel = kernel;
        this._tickLength = 1000 / tickRate;
    }
    Runner.prototype.start = function () {
        this._stopped = false;
        this._prevTime = (new Date()).valueOf();
        rAF(onTick(this));
    };
    Runner.prototype.stop = function () {
        this._stopped = true;
    };
    Runner.prototype.on = function (event, callback) {
        this._emitter.on(event, callback);
    };
    Runner.prototype.off = function (event, callback) {
        this._emitter.off(event, callback);
    };
    Runner.BEGIN_EVENT = 'beginFrame';
    Runner.END_EVENT = 'endFrame';
    return Runner;
})();
// TODO: Danger Will Robinson: this loop might accidentally start firing twice,
// if you call start() and stop() in quick succession. rAF could fire off a
// second loop, and by the time the first one comes back it'll no longer be
// stopped.
function onTick(runner) {
    function loop() {
        if (runner._stopped)
            return;
        var timestamp = (new Date).valueOf();
        runner._emitter.trigger(Runner.BEGIN_EVENT, null);
        runUpdate(runner, timestamp - runner._prevTime);
        runner._emitter.trigger(Runner.END_EVENT, null);
        runner._prevTime = timestamp;
        rAF(loop);
    }
    return loop;
}
function runUpdate(runner, delta) {
    var consumed = 0;
    var tickLength = runner._tickLength;
    runner._elapsed += Math.min(delta, tickLength * MAX_FRAMESKIP);
    while (runner._elapsed > tickLength) {
        runner._kernel.tick(tickLength);
        runner._elapsed -= tickLength;
        consumed += tickLength;
    }
    if (consumed > 0)
        runner._kernel.render(consumed);
}
module.exports = Runner;
