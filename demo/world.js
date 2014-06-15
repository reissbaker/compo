'use strict';

var compo = require('compo'),
    behavior = require('./behavior/system'),
    Keylogger = require('./components/keylogger'),
    PositionLogger = require('./components/position-logger'),
    Player = require('./game-objects/player'),
    NPC = require('./game-objects/npc'),
    Level = require('./game-objects/level'),
    Matrix = require('./data/matrix');

var NUM_NPCS = 20;

module.exports = {
  build: function(kernel) {
    var world = kernel.root().entity();

    for(i = 0; i < NUM_NPCS; i++) {
      new NPC(world.entity());
    }


    var i, tile, matrix, level,
        numTiles = Math.ceil(document.body.clientWidth / 48);

    matrix = new Matrix(2, numTiles, -1);
    for(i = 0; i < numTiles; i++) {
      matrix.set(1, i, 0);
    }
    matrix.set(0, numTiles - 1, 0);
    level = new Level(world.entity(), matrix);
    level.loc.y = 48 * 10;


    var player = new Player(world.entity());

    behavior.table.attach(player.entity, new PositionLogger(player.loc));
    behavior.table.attach(player.entity, new Keylogger());


    return world;
  }
};

