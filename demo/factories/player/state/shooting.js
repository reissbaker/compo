'use strict';

var compo = require('compo'),
    bulletFactory = require('../../bullet'),
    PlayerState = require('./player');

var ShootingState = compo.extend(PlayerState, function(args) {
  PlayerState.call(this, args);
  this.keepShooting = false;
  this.count = 0;
});

// Disable movement.
ShootingState.prototype.left = function() {};
ShootingState.prototype.right = function() {};

ShootingState.prototype.begin = function() {
  this.physics.acceleration.x = 0;
  this.count = 0;
  fire(this.engine, this.world, this.anim, this.character.data);
};

ShootingState.prototype.attack = function() {
  this.keepShooting = true;
};

ShootingState.prototype.update = function() {
  if(this.anim.stopped()) {
    if(this.keepShooting) {
      // TODO: Refactor all of the bullet firing into a Gun class.
      // The player has a gun, which this state fires.
      // Gun instance determines rate of fire.
      this.count++;
      if(this.count >= 10) {
        fire(this.engine, this.world, this.anim, this.character.data);
        this.count = 0;
      }
    } else {
      this.transition('walking');
    }
  }
  this.keepShooting = false;
};

function fire(engine, world, anim, shooterData) {
  anim.playAndStop('shoot');
  shootBullet(engine, world, shooterData);
}

function shootBullet(engine, world, shooterData) {
  var bullet = bulletFactory.build(engine, world);
  var bulletMid = bullet.data.hitbox.height / 2;
  var shooterMid = shooterData.hitbox.height / 2;
  bullet.data.loc.x = shooterData.loc.x;
  bullet.data.loc.y = shooterData.loc.y + shooterMid - bulletMid + 4;
  bullet.physics.velocity.x = bullet.physics.maxVelocity.x * shooterData.dir.x;
  bullet.data.loc.x += shooterData.hitbox.width / 2 * shooterData.dir.x;
}

module.exports = ShootingState;
