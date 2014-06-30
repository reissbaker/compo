'use strict';

var compo = require('compo'),
    GameObject = require('./game-object'),
    swordguy = require('./decorators/swordguy');

module.exports = compo.extend(GameObject, function(entity) {
  GameObject.call(this, entity, 0, 0, 9, 3, (24 - 9), 32 - 3);

  var components = swordguy(this);
  this.physics = components.physics;
  this.graphics = components.graphics;

  var width = document.body.clientWidth / 4;
  this.loc.x = Math.random() * width;
});
