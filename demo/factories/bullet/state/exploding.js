'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var ExplodingState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

ExplodingState.prototype.begin = function() {
  this.graphics.playAndStop('explode');
};

ExplodingState.prototype.update = function() {
  if(this.graphics.stopped()) this.entity.destroy();
};

module.exports = ExplodingState;
