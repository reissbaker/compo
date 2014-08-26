'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var ACCEL = 900;

var WalkingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.moved = false;
});

WalkingState.prototype.begin = function() {
  this.anim.playLoop('walk');
  this.moved = true;
};

WalkingState.prototype.left = function() {
  this.moved = true;
  this.physics.acceleration.x = -ACCEL;
  this.dir.x = -1;
};

WalkingState.prototype.right = function() {
  this.moved = true;
  this.physics.acceleration.x = ACCEL;
  this.dir.x = 1;
};

WalkingState.prototype.jump = function() {
  this.transition('jumping');
};

WalkingState.prototype.update = function() {
  if(!this.moved) this.transition('standing');
  this.moved = false;
};

module.exports = WalkingState;

