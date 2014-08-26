'use strict';

var compo = require('compo');

var PlayerState = compo.extend(compo.State, function(args) {
  compo.State.call(this);
  this.states = args.states;
  this.engine = args.engine;
  this.character = args.character;
  this.physics = this.character.physics;
  this.anim = this.character.graphics;
  this.dir = this.character.data.dir;
});

PlayerState.prototype.jump = function() {};
PlayerState.prototype.left = function() {};
PlayerState.prototype.right = function() {};
PlayerState.prototype.attack = function() {};

module.exports = PlayerState;

