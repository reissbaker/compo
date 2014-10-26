'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var WalkingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.moved = false;
});

WalkingState.prototype.begin = function() {
  this.anim.playLoop('walk');
  this.moved = true;
};

WalkingState.prototype.left = function() {
  PlayerState.prototype.left.call(this);
  this.moved = true;
};

WalkingState.prototype.right = function() {
  PlayerState.prototype.right.call(this);
  this.moved = true;
};

WalkingState.prototype.jump = function() {
  this.transition('jumping');
};

WalkingState.prototype.attack = function() {
  this.transition('shooting');
};

WalkingState.prototype.update = function() {
  if(!this.moved) this.transition('standing');
  this.moved = false;
};

module.exports = WalkingState;

