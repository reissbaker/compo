'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var JUMP_POWER = 400;

var JumpingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.moved = false;
});

JumpingState.prototype.begin = function() {
  this.physics.velocity.y = -JUMP_POWER;
  this.moved = true;
  this.anim.playLoop('jump');
};

JumpingState.prototype.left = function() {
  PlayerState.prototype.left.call(this);
  this.moved = true;
};
JumpingState.prototype.right = function() {
  PlayerState.prototype.right.call(this);
  this.moved = true;
};

JumpingState.prototype.land = function() {
  this.transition('standing');
};

// TODO: A jumping-and-shooting state that tracks landings but allows
// shooting for neat mid-air reversals.
// Shooting here would transition to that state.
// Mid-air shooting should prob have more x-velocity.

JumpingState.prototype.update = function() {
  if(!this.moved) this.physics.acceleration.x = 0;
  this.moved = false;
};

module.exports = JumpingState;

