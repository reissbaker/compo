'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var StandingState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

StandingState.prototype.begin = function() {
  this.graphics.playLoop('stand');
};

StandingState.prototype.takeDamage = function() {
  this.transition('dying');
};

module.exports = StandingState;
