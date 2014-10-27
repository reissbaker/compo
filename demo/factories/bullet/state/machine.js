'use strict';

var compo = require('compo'),
    FiringState = require('./firing'),
    FiredState = require('./fired'),
    ExplodingState = require('./exploding');


var BulletStateMachine = compo.extend(compo.StateMachine, function(args) {
  compo.StateMachine.call(this, {
    firing: new FiringState(args),
    fired: new FiredState(args),
    exploding: new ExplodingState(args)
  });

  this.setState('firing');
});

BulletStateMachine.prototype.update = function(delta) {
  this.currentState().update(delta);
};

BulletStateMachine.prototype.collide = function() {
  this.currentState().collide();
};

module.exports = BulletStateMachine;
