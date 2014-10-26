'use strict';

var compo = require('compo');

module.exports = function(loc, hitbox, type) {
  this.loc = loc;
  this.hitbox = hitbox;
  this.active = true;
  this.type = type;
  this.emitter = new compo.Emitter();
};

