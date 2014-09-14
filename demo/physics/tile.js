'use strict';

var compo = require('compo'),
    Point = require('../data/point'),
    Collidable = require('./collidable');

var PhysicsComponent = compo.extend(compo.Component, function(loc, hitbox) {
  this.collidable = new Collidable(loc, hitbox);

  this.velocity = new Point;
  this.maxVelocity = new Point;
  this.acceleration = new Point;
  this.drag = new Point;
  this.gravity = new Point;

  this.immovable = false;

  this.emitter = new compo.Emitter();
});


module.exports = PhysicsComponent;
