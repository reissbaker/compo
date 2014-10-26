'use strict';

var physics = require('./physics'),
    Direction = require('../../data/direction');

function Bullet(data, physics, graphics) {
  this.data = data;
  this.physics = physics;
  this.graphics = graphics;
}

Bullet.prototype.left = function() {
  this.physics.velocity.x = -physics.SHOOT_SPEED;
  this.dir.x = Direction.LEFT;
};
Bullet.prototype.right = function() {
  this.physics.velocity.x = physics.SHOOT_SPEED;
  this.dir.x = Direction.RIGHT;
};

module.exports = Bullet;
