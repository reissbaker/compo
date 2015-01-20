'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var JUMP_POWER = 400;

var FallingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.moved = false;
});

FallingState.prototype.begin = function() {
  this.moved = true;
  this.anim.playLoop('jump');
};

FallingState.prototype.left = function() {
  PlayerState.prototype.left.call(this);
  this.moved = true;
};

FallingState.prototype.right = function() {
  PlayerState.prototype.right.call(this);
  this.moved = true;
};

FallingState.prototype.land = function() {
  this.transition('standing');
};

FallingState.prototype.attack = function() {
  if(this.gun.canFire()) this.transition('jumpingAndShooting');
};

FallingState.prototype.update = function() {
  if(!this.moved) this.physics.acceleration.x = 0;
  this.moved = false;
};

module.exports = FallingState;

