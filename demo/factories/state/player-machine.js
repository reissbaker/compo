'use strict';

var compo = require('compo'),
    StandingState = require('./standing'),
    WalkingState = require('./walking');

var PlayerStateMachine = compo.extend(compo.StateMachine, function(args) {
  compo.StateMachine.call(this, {
    standing: new StandingState(args),
    walking: new WalkingState(args)
  });

  this.setState('standing');
});

PlayerStateMachine.prototype.left = function() {
  this.currentState().left();
};

PlayerStateMachine.prototype.right = function() {
  this.currentState().right();
};

PlayerStateMachine.prototype.attack = function() {
  this.currentState().attack();
};

PlayerStateMachine.prototype.jump = function() {
  this.currentState().jump();
};

module.exports = PlayerStateMachine;
