'use strict';

var compo = require('compo');

var BaseState = compo.extend(compo.State, function(args) {
  compo.State.call(this);

  this.states = args.states;
  this.engine = args.engine;
  this.world = args.world;
  this.bullet = args.bullet;
  this.entity = args.entity;

  this.graphics = args.bullet.graphics;
  this.physics = args.bullet.physics;
  this.dir = args.bullet.data.dir;
});

BaseState.prototype.update = function(delta) {};
BaseState.prototype.collide = function() {
  this.transition('exploding');
};

module.exports = BaseState;
