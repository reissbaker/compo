'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var FiringState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

FiringState.prototype.begin = function() {
  this.graphics.playAndStop('fire');
};

FiringState.prototype.update = function() {
  if(this.graphics.stopped()) this.transition('fired');
};

module.exports = FiringState;
