'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var ShootingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.keepShooting = false;
});

// Disable movement.
ShootingState.prototype.left = function() {};
ShootingState.prototype.right = function() {};

ShootingState.prototype.begin = function() {
  this.anim.playAndStop('shoot');
  this.gun.fire();
};

ShootingState.prototype.jump = function() {
  this.transition('jumping');
};

ShootingState.prototype.attack = function() {
  this.keepShooting = true;
};

ShootingState.prototype.update = function() {
  if(this.anim.stopped()) {
    if(this.keepShooting) {
      if(this.gun.fire()) {
        this.anim.playAndStop('shoot');
      }
    } else {
      this.transition('walking');
    }
  }
  this.keepShooting = false;
};

module.exports = ShootingState;
