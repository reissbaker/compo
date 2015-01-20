'use strict';

var compo = require('compo'),
    behavior = require('./behavior/system'),
    buildPlayer = require('./factories/player'),
    buildNpc = require('./factories/rabbit'),
    buildLevel = require('./factories/level'),
    ImageMap = require('./maps/image-map'),
    Matrix = require('./data/matrix');

var NUM_NPCS = 10;

module.exports = {
  build: function(engine, levels) {
    var world = engine.kernel.root().entity();
    var map = new ImageMap({
      image: levels[0],
      tile: {
        value: 22,
        width: 16,
        height: 16
      }
    });

    var level = buildLevel(engine, world, map.levelMatrix);

    var camera = engine.renderer.camera;

    for(var i = 0; i < NUM_NPCS; i++) {
      var rabbit = buildNpc(engine, world);
      var loc = rabbit.data.loc;
      loc.y = 32;
      if(loc.x < 16) loc.x = 32;
      if(loc.x > camera.viewportWidth() - 16) loc.x = 32;
    }

    camera.bounds.left = 0;
    camera.bounds.top = 0;
    camera.bounds.right = map.levelMatrix.numCols * 16;
    camera.bounds.bottom = map.levelMatrix.numRows * 16;

    engine.player = buildPlayer(engine, world);
    engine.player.data.loc.y = 200;
    engine.player.data.loc.x = 32;

    return world;
  }
};

