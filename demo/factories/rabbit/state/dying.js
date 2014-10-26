'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var DyingState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

DyingState.prototype.begin = function() {
  this.graphics.playAndStop('die');
};

DyingState.prototype.update = function() {
  if(this.graphics.stopped()) {
    this.engine.kernel.db.destroy(this.entity);
  }
};

module.exports = DyingState;
