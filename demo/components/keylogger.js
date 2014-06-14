'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var Behavior = compo.Behavior,
    extend = compo.extend;

var Keylogger = compo.extend(Behavior, function(){});

Keylogger.prototype.update = function(delta) {
  if(keyboard.pressed(keyboard.key.X)) console.log('x pressed');
  if(keyboard.down(keyboard.key.X))  console.log('x down');
};

module.exports = Keylogger;
