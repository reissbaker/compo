'use strict';

var compo = require('compo');

var ObjectController = compo.extend(compo.Behavior, function(state) {
  compo.Behavior.call(this);
  this.state = state;
});

ObjectController.prototype.update = function(delta) {
  this.state.update(delta);
};

module.exports = ObjectController;
