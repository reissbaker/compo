'use strict';

var compo = require('compo'),
    behavior = require('./behavior/system'),
    buildPlayer = require('./factories/player'),
    buildNpc = require('./factories/rabbit'),
    buildLevel = require('./factories/level'),
    Matrix = require('./data/matrix');

var NUM_NPCS = 10;

module.exports = {
  build: function(engine) {
    engine.renderer.cameraBounds.x = 0;

    var world = engine.kernel.root().entity();

    for(i = 0; i < NUM_NPCS; i++) {
      buildNpc(engine, world);
    }


    var i, tile, matrix, level,
        numTiles = Math.ceil(document.body.clientWidth / (16 * 3));

    matrix = new Matrix(2, numTiles, -1);
    for(i = 0; i < numTiles; i++) {
      matrix.set(1, i, 22);
    }

    matrix.set(0, numTiles - 1, 22);
    level = buildLevel(engine, world, matrix);
    level.loc.y = ((16 * 30) / 3) | 0;


    engine.player = buildPlayer(engine, world);

    return world;
  }
};
