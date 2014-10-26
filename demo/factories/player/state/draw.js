'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var DrawState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
});

// Disable movement.
DrawState.prototype.left = function() {};
DrawState.prototype.right = function() {};

DrawState.prototype.begin = function() {
  this.physics.acceleration.x = 0;
  this.anim.playAndStop('draw');
};

DrawState.prototype.update = function() {
  if(this.anim.stopped()) this.transition('shooting');
};

module.exports = DrawState;
