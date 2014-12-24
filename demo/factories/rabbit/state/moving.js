'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var MovingState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

MovingState.prototype.begin = function() {
  this.graphics.playAndStop('hop');
};

MovingState.prototype.update = function() {
  if(this.graphics.stopped()) this.transition('standing');
};

module.exports = MovingState;
