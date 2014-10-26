'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var Controller = compo.extend(compo.Behavior, function(character, state) {
  compo.Behavior.call(this);
  this.state = state;
});

Controller.prototype.update = function(delta) {
  if(keyboard.down(keyboard.key.LEFT)) this.state.left();
  else if(keyboard.down(keyboard.key.RIGHT)) this.state.right();

  if(keyboard.down(keyboard.key.X)) this.state.jump();
  if(keyboard.down(keyboard.key.C)) this.state.attack();

  this.state.update(delta);
};

module.exports = Controller;
