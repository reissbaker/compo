!function(exports) {
  'use strict';

  var TARGET_FPS = 60,
      TARGET_FRAMETIME = 1000 / TARGET_FPS,
      MIN_FRAMETIME = 10;

  function getTimeout(runFn) {
    var prevTime,
        nextTickTime = TARGET_FRAMETIME,
        stopped = false;

    function onTick() {
      if(stopped) return;

      var timestamp = (new Date).valueOf(),
          delta = timestamp - prevTime,
          offset = delta - nextTickTime;

      prevTime = timestamp;
      nextTickTime = TARGET_FRAMETIME - offset;
      if(nextTickTime < MIN_FRAMETIME) nextTickTime = MIN_FRAMETIME;

      runFn(delta);
    };

    function keepGoing(nextTickTime) {
      setTimeout(onTick, nextTickTime);
    }

    return {
      start: function() { 
        stopped = false;
        prevTime = (new Date).valueOf();
        keepGoing(TARGET_FRAMETIME);
      },
      stop: function() { stopped = true; }
    };
  }

  exports.loop = {
    timeout: getTimeout
  };

}(seine);
