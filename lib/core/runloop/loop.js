!function(window, exports) {
  'use strict';

  var TARGET_FPS = 60,
      TARGET_FRAMETIME = 1000 / TARGET_FPS,
      MIN_FRAMETIME = 10;

  var rAF = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            fallback;

  function fallback(callback) {
    setTimeout(callback, TARGET_FRAMETIME);
  }

  function getTimeout(runFn) {
    var prevTime,
        stopped = false;

    function onTick() {
      if(stopped) return;

      var timestamp = (new Date).valueOf(),
          delta = timestamp - prevTime;

      prevTime = timestamp;

      runFn(delta);
      rAF(onTick);
    }

    return {
      start: function() {
        stopped = false;
        prevTime = (new Date).valueOf();
        rAF(onTick);
      },
      stop: function() { stopped = true; }
    };
  }

  exports.loop = {
    timeout: getTimeout
  };

}(window, compo);
