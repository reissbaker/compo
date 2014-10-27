'use strict';

var compo = require('compo'),
    BaseState = require('./base-state');

var FiredState = compo.extend(BaseState, function(args) {
  BaseState.call(this, args);
});

FiredState.prototype.begin = function() {
  this.graphics.playLoop('flash');
};

module.exports = FiredState;
