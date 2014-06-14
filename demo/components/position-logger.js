'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var Behavior = compo.Behavior,
    extend = compo.extend;

var PositionLogger = compo.extend(Behavior, function(position) {
  this.pos = position;
});

PositionLogger.prototype.update = function(delta) {
  if(keyboard.pressed(keyboard.key.ENTER)) {
    console.log(this.pos.x, this.pos.y);
  }
};

module.exports = PositionLogger;
