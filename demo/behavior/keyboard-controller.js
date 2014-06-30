'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var ACCEL = 1000,
    JUMP_POWER = 500;

var Controller = compo.extend(compo.Behavior, function(dir, physics) {
  compo.Behavior.call(this);
  this.physics = physics;
  this.dir = dir;
});

Controller.prototype.update = function() {
  var physics = this.physics;

  if(keyboard.down(keyboard.key.LEFT)) {
    physics.acceleration.x = -ACCEL;
    this.dir.x = -1;
  } else if(keyboard.down(keyboard.key.RIGHT)) {
    physics.acceleration.x = ACCEL;
    this.dir.x = 1;
  } else {
    physics.acceleration.x = 0;
  }

  if(keyboard.pressed(keyboard.key.X)) {
    physics.velocity.y = -JUMP_POWER;
  }
};

module.exports = Controller;
