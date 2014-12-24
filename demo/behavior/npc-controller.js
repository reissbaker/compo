'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var NpcController = compo.extend(compo.Behavior, function(state) {
  compo.Behavior.call(this);
  this.state = state;
});

NpcController.prototype.update = function(delta) {
  if(keyboard.pressed(keyboard.key.D)) this.state.left();
  if(keyboard.pressed(keyboard.key.A)) this.state.right();

  this.state.update(delta);
};

module.exports = NpcController;
