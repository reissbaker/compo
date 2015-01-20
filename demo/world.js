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

    map.npcSpawnPoints.forEach(function(spawnPoint) {
      var rabbit = buildNpc(engine, world);
      var loc = rabbit.data.loc;
      var hitbox = rabbit.data.hitbox;
      loc.x = spawnPoint.x - (hitbox.width - 16);
      loc.y = spawnPoint.y - (hitbox.height - 16);
    });

    camera.bounds.left = 0;
    camera.bounds.top = 0;
    camera.bounds.right = map.levelMatrix.numCols * 16;
    camera.bounds.bottom = map.levelMatrix.numRows * 16;

    engine.player = buildPlayer(engine, world);
    var loc = engine.player.data.loc;
    var hitbox = engine.player.data.hitbox;
    loc.y = map.playerSpawnPoint.y - (hitbox.height - 16);
    loc.x = map.playerSpawnPoint.x - (hitbox.width - 16);

    camera.centerOn(loc.x, loc.y);

    return world;
  }
};

