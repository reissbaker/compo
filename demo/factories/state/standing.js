'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var StandingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
});

StandingState.prototype.begin = function() {
  this.physics.acceleration.x = 0;
  this.anim.playLoop('stand');
};

StandingState.prototype.left = function() {
  this.transition('walking');
};

StandingState.prototype.right = function() {
  this.transition('walking');
};

StandingState.prototype.jump = function() {
  this.transition('jumping');
};

module.exports = StandingState;

