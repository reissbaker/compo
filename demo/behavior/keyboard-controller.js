'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var ACCEL = 900,
    JUMP_POWER = 400;

var Controller = compo.extend(compo.Behavior, function(dir, physics, anim) {
  compo.Behavior.call(this);
  this.physics = physics;
  this.anim = anim;
  this.dir = dir;
  this.running = false;
});

Controller.prototype.update = function() {
  var physics = this.physics;

  var wasRunning = this.running;
  this.running = true;

  if(keyboard.down(keyboard.key.LEFT)) {
    physics.acceleration.x = -ACCEL;
    this.dir.x = -1;
  } else if(keyboard.down(keyboard.key.RIGHT)) {
    physics.acceleration.x = ACCEL;
    this.dir.x = 1;
  } else {
    physics.acceleration.x = 0;
    this.running = false;
  }

  if(wasRunning != this.running) {
    if(this.running) this.anim.playLoop('walk');
    else this.anim.playLoop('stand');
  }

  if(keyboard.pressed(keyboard.key.X)) {
    physics.velocity.y = -JUMP_POWER;
  }
};

module.exports = Controller;
