'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var JUMP_POWER = 400;

var Controller = compo.extend(compo.Behavior, function(character, state) {
  compo.Behavior.call(this);
  this.physics = character.physics;
  this.anim = character.graphics;
  this.dir = character.data.dir;
  this.state = state;
});

Controller.prototype.update = function(delta) {
  var physics = this.physics;

  if(keyboard.down(keyboard.key.LEFT)) this.state.left();
  else if(keyboard.down(keyboard.key.RIGHT)) this.state.right();

  this.state.update(delta);

  if(keyboard.pressed(keyboard.key.X)) {
    physics.velocity.y = -JUMP_POWER;
  }
};

module.exports = Controller;
