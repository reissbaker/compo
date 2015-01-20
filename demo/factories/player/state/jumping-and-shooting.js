'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var JUMP_POWER = 400;

var JumpingAndShootingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.keepShooting = false;
});

JumpingAndShootingState.prototype.begin = function() {
  this.keepShooting = false;
  this.gun.fire();
  this.anim.playAndStop('shoot');
};

JumpingAndShootingState.prototype.left = function() {};
JumpingAndShootingState.prototype.right = function() {};

JumpingAndShootingState.prototype.attack = function() {
  this.keepShooting = true;
};

JumpingAndShootingState.prototype.land = function() {
  this.transition('standing');
};

JumpingAndShootingState.prototype.update = function() {
  if(this.anim.stopped()) {
    if(this.keepShooting) {
      if(this.gun.fire()) {
        this.anim.playAndStop('shoot');
      }
    } else {
      this.transition('falling');
    }
  }
  this.keepShooting = false;
};

module.exports = JumpingAndShootingState;

