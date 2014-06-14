'use strict';

var compo = require('compo'),
    behavior = require('./behavior/system'),
    Keylogger = require('./components/keylogger'),
    PositionLogger = require('./components/position-logger'),
    physics = require('./physics/system'),
    Tile = require('./physics/tile'),
    Rect = require('./data/rect');

module.exports = {
  build: function(kernel) {
    var world = kernel.root().entity(),
        player = world.entity();

    var Position = compo.extend(compo.Component, function() {
      this.x = 0;
      this.y = 0;
    });
    var posTable = kernel.db.table();
    var pos = posTable.attach(player, new Position());

    behavior.table.attach(player, new PositionLogger(pos));
    behavior.table.attach(player, new Keylogger());

    var hitbox = new Rect(0, 0, 32, 32);
    var physComponent = physics.tiles.attach(player, new Tile(pos, hitbox));
    physComponent.gravity.y = 10;
    physComponent.maxVelocity.y = 100;

    return world;
  }
};


/*
var Entity = compo.Entity,
    Keylogger = demo.Keylogger,
    Player = demo.Player,
    NPC = demo.NPC,
    Level = demo.Level,
    Matrix = exports.Matrix;

var NUM_NPCS = 20;

var World = Entity.extend({
  start: function() {
    var i, tile, matrix, level,
        numTiles = Math.ceil(document.body.clientWidth / 48);
    this.push(new Keylogger);

    matrix = new Matrix(2, numTiles, -1);
    for(i = 0; i < numTiles; i++) {
      matrix.set(1, i, 0);
    }
    matrix.set(0, numTiles - 1, 0);
    level = new Level(matrix);
    level.loc.y = 48 * 10;
    this.push(level);

    for(i = 0; i < NUM_NPCS; i++) {
      this.push(new NPC);
    }

    this.push(new Player);
  }
});

exports.World = World;
*/
