'use strict';

var compo = require('compo'),
    bulletFactory = require('../../bullet'),
    PlayerState = require('./player');

var JUMP_POWER = 400;

var JumpingAndShootingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.moved = false;
  this.count = 0;
  this.keepShooting = false;
});

JumpingAndShootingState.prototype.begin = function() {
  this.keepShooting = false;
  this.physics.acceleration.x = 0;
  this.count = 0;
  fire(this.engine, this.world, this.anim, this.character);
};

JumpingAndShootingState.prototype.left = function() {};
JumpingAndShootingState.prototype.right = function() {};

JumpingAndShootingState.prototype.attack = function() {
  this.keepShooting = true;
};

JumpingAndShootingState.prototype.land = function() {
  this.transition('standing');
};

JumpingAndShootingState.prototype.update = function() {
  if(this.anim.stopped()) {
    if(this.keepShooting) {
      // TODO: Refactor all of the bullet firing into a Gun class.
      // The player has a gun, which this state fires.
      // Gun instance determines rate of fire.
      this.count++;
      if(this.count >= 10) {
        fire(this.engine, this.world, this.anim, this.character);
        this.count = 0;
      }
    } else {
      this.transition('falling');
    }
  }
  this.keepShooting = false;
};

function fire(engine, world, anim, shooter) {
  anim.playAndStop('shoot');
  shooter.physics.velocity.x = -shooter.data.dir.x * 200;
  shooter.physics.velocity.y -= 50;
  shootBullet(engine, world, shooter.data);
}

function shootBullet(engine, world, shooterData) {
  var bullet = bulletFactory(engine, world);
  var bulletMid = bullet.data.hitbox.height / 2;
  var shooterMid = shooterData.hitbox.height / 2;
  bullet.data.loc.x = shooterData.loc.x;
  bullet.data.loc.y = shooterData.loc.y + shooterMid - bulletMid + 4;
  bullet.physics.velocity.x = bullet.physics.maxVelocity.x * shooterData.dir.x;
  bullet.data.loc.x += shooterData.hitbox.width / 2 * shooterData.dir.x;
  bullet.data.dir.x = shooterData.dir.x;
}

module.exports = JumpingAndShootingState;

