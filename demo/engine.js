'use strict';

var compo = require('compo'),
    behavior = require('./behavior/system'),
    keyboard = require('./input/keyboard'),
    physics = require('./physics/system'),
    renderer = require('./graphics/renderer');

module.exports = compo.extend(compo.Engine, function(kernel) {
  compo.Engine.call(this, kernel);

  this.keyboard = keyboard;
  kernel.attach(keyboard);

  this.behavior = behavior;
  kernel.attach(behavior);

  this.physics = physics;
  kernel.attach(physics);

  this.renderer = renderer;
  kernel.attach(renderer);

  this.endGame = null;

  this.player = null;
});

