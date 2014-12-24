'use strict';

var compo = require('compo'),
    Direction = require('../../../data/direction');

var ACCEL = 700;

var BaseState = compo.extend(compo.State, function(args) {
  compo.State.call(this);

  this.states = args.states;
  this.engine = args.engine;
  this.world = args.world;
  this.character = args.character;
  this.entity = args.entity;

  this.graphics = args.character.graphics;
  this.physics = args.character.physics;
  this.dir = args.character.data.dir;
});

BaseState.prototype.update = function(delta) {};
BaseState.prototype.takeDamage = function(xDir, yDir) {};
BaseState.prototype.left = function() {
  this.dir.x = Direction.LEFT;
  this.physics.acceleration.x = ACCEL;
};
BaseState.prototype.right = function() {
  this.dir.x = Direction.RIGHT;
  this.physics.acceleration.x = -ACCEL;
};
BaseState.prototype.attack = function() {};

module.exports = BaseState;
