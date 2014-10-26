'use strict';

var compo = require('compo');

var BaseState = compo.extend(compo.State, function(args) {
  compo.State.call(this);

  this.states = args.states;
  this.engine = args.engine;
  this.world = args.world;
  this.character = args.character;
  this.entity = args.entity;

  this.graphics = args.character.graphics;
  this.physics = args.character.physics;
});

BaseState.prototype.update = function(delta) {};
BaseState.prototype.takeDamage = function() {};

module.exports = BaseState;
