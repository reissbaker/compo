'use strict';

var compo = require('compo'),
    behavior = require('./behavior/system'),
    buildPlayer = require('./factories/player'),
    buildNpc = require('./factories/npc'),
    buildLevel = require('./factories/level'),
    Matrix = require('./data/matrix');

var NUM_NPCS = 10;

module.exports = {
  build: function(engine) {
    var world = engine.kernel.root().entity();

    for(i = 0; i < NUM_NPCS; i++) {
      buildNpc(world.entity());
    }


    var i, tile, matrix, level,
        numTiles = Math.ceil(document.body.clientWidth / (24 * 3));

    matrix = new Matrix(2, numTiles, -1);
    for(i = 0; i < numTiles; i++) {
      matrix.set(1, i, 0);
    }
    matrix.set(0, numTiles - 1, 0);
    level = buildLevel(world.entity(), matrix);
    level.loc.y = ((24 * 20) / 3) | 0;


    buildPlayer(world.entity());

    return world;
  }
};
