'use strict';

var compo = require('compo'),
    GameObject = require('./game-object'),
    behavior = require('../behavior/system'),
    Controller = require('../components/node-keyboard-controller'),
    swordguy = require('./decorators/swordguy');

module.exports = compo.extend(GameObject, function(entity) {
  GameObject.call(this, entity, 0, 0, 48, 32);

  var components = swordguy(this);
  this.physics = components.physics;
  this.graphics = components.graphics;

  behavior.table.attach(entity, new Controller(this.dir, this.physics));
});

