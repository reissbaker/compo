'use strict';

var compo = require('compo');

var ACCEL = 900;
var PlayerState = compo.extend(compo.State, function(args) {
  compo.State.call(this);
  this.states = args.states;
  this.engine = args.engine;
  this.world = args.world;
  this.character = args.character;
  this.gun = args.gun;

  this.physics = this.character.physics;
  this.anim = this.character.graphics;
  this.dir = this.character.data.dir;
  this.loc = this.character.data.loc;
});

PlayerState.prototype.jump = function() {};
PlayerState.prototype.land = function() {};
PlayerState.prototype.left = function() {
  this.physics.acceleration.x = -ACCEL;
  this.dir.x = -1;
};
PlayerState.prototype.right = function() {
  this.physics.acceleration.x = ACCEL;
  this.dir.x = 1;
};
PlayerState.prototype.attack = function() {};
PlayerState.prototype.takeDamage = function() {
  this.engine.endGame();
};
PlayerState.prototype.stomp = function() {
  this.physics.acceleration.y = 0;
  this.physics.velocity.y = -200;
};

module.exports = PlayerState;

