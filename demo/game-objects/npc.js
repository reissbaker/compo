'use strict';

var compo = require('compo'),
    GameObject = require('./game-object'),
    swordguy = require('./decorators/swordguy');

module.exports = compo.extend(GameObject, function(entity) {
  GameObject.call(this, entity, 0, 0, 48, 32);

  var components = swordguy(this);
  this.physics = components.physics;
  this.graphics = components.graphics;

  var width = document.body.clientWidth;
  this.loc.x = Math.random() * width;
});

