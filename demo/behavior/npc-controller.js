'use strict';

var compo = require('compo');

var NpcController = compo.extend(compo.Behavior, function(state) {
  compo.Behavior.call(this);
  this.state = state;
});

NpcController.prototype.update = function(delta) {
  this.state.update(delta);
};

module.exports = NpcController;
