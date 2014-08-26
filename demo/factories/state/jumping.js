'use strict';

var compo = require('compo'),
    PlayerState = require('./player');

var JumpingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
});

JumpingState.prototype.left = function() {
};

JumpingState.prototype.right = function() {
};

JumpingState.prototype.jump = function() {
};

JumpingState.prototype.update = function(delta) {
};

