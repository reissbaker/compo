'use strict';

var compo = require('compo'),
    bulletFactory = require('../bullet');

var FRAMES_TO_RELOAD = 12;

var Gun = compo.extend(compo.Behavior, function(engine, world, shooter) {
  compo.Behavior.call(this);

  this.count = 0;
  this.reloading = false;
  this.shooter = shooter;
  this.engine = engine;
  this.world = world;
});

Gun.prototype.canFire = function() {
  return !this.reloading;
};

Gun.prototype.update = function(delta) {
  if(this.reloading) {
    this.count--;
    if(this.count === 0) {
      this.reloading = false;
    }
  }
};

Gun.prototype.fire = function() {
  if(!this.canFire()) return false;

  shoot(this.engine, this.world, this.shooter);

  this.reloading = true;
  this.count = FRAMES_TO_RELOAD;

  return true;
};

function shoot(engine, world, shooter) {
  shooter.physics.acceleration.x = 0;
  shooter.physics.velocity.x -= shooter.data.dir.x * 200;
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

module.exports = Gun;
