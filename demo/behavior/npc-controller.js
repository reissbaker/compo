'use strict';

var compo = require('compo'),
    keyboard = require('../input/keyboard');

var NpcController = compo.extend(compo.Behavior, function(state, engine, npc) {
  compo.Behavior.call(this);
  this.state = state;
  this.engine = engine;
  this.npc = npc;
});

NpcController.prototype.update = function(delta) {
  var player = this.engine.player;

  if(playerIsLeft(player, this.npc)) this.state.left();
  if(playerIsRight(player, this.npc)) this.state.right();

  this.state.update(delta);
};

function playerIsLeft(player, npc) {
  return characterMidpoint(player) > characterMidpoint(npc);
}

function playerIsRight(player, npc) {
  return characterMidpoint(player) < characterMidpoint(npc);
}

function characterMidpoint(character) {
  return midpoint(character.data.loc.x, character.data.hitbox.width);
}
function midpoint(coord, dim) {
  return coord + dim / 2;
}

module.exports = NpcController;
