'use strict';

var compo = require('compo'),
    StandingState = require('./standing'),
    DyingState = require('./dying');


var RabbitStateMachine = compo.extend(compo.StateMachine, function(args) {
  compo.StateMachine.call(this, {
    standing: new StandingState(args),
    dying: new DyingState(args)
  });

  this.setState('standing');
});

RabbitStateMachine.prototype.update = function(delta) {
  this.currentState().update(delta);
};

RabbitStateMachine.prototype.takeDamage = function(xDir, yDir) {
  this.currentState().takeDamage(xDir, yDir);
};

module.exports = RabbitStateMachine;
