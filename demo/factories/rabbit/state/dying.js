'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var DyingState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

DyingState.prototype.begin = function() {
  this.physics.active = false;
  this.graphics.playAndStop('die');
};

DyingState.prototype.update = function() {
  if(this.graphics.stopped()) this.entity.destroy();
};

// When you're dying, don't keep taking more damage.
DyingState.prototype.takeDamage = function() {};

module.exports = DyingState;
