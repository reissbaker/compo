'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var StandingState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

StandingState.prototype.begin = function() {
  this.graphics.playLoop('stand');
  this.physics.acceleration.x = 0;
};

StandingState.prototype.left = function() {
  BaseState.prototype.left.call(this);
  this.transition('moving');
};

StandingState.prototype.right = function() {
  BaseState.prototype.right.call(this);
  this.transition('moving');
};

module.exports = StandingState;
