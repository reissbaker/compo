'use strict';

var compo = require('compo'),
    behavior = require('./behavior/system'),
    buildPlayer = require('./factories/player'),
    buildNpc = require('./factories/rabbit'),
    buildLevel = require('./factories/level'),
    Matrix = require('./data/matrix');

var NUM_NPCS = 10;

module.exports = {
  build: function(engine, levels) {
    var world = engine.kernel.root().entity();

    for(var i = 0; i < NUM_NPCS; i++) {
      buildNpc(engine, world);
    }

    var matrix = levelMatrix(ctxFromImage(levels[0]));
    var level = buildLevel(engine, world, matrix);

    var camera = engine.renderer.camera;

    camera.bounds.left = 0;
    camera.bounds.bottom = matrix.numRows * 16;

    engine.player = buildPlayer(engine, world);
    engine.player.data.loc.y = 200;
    engine.player.data.loc.x = 32;

    return world;
  }
};


/*
 * These functions belong elsewhere.
 */

function levelMatrix(canvas) {
  var ctx = canvas.getContext('2d');
  var matrix = new Matrix(canvas.height, canvas.width, -1);
  for(var r = 0; r < matrix.numRows; r++) {
    for(var c = 0; c < matrix.numCols; c++) {
      var pixel = ctx.getImageData(c, r, 1, 1).data;
      if(pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 255) {
        matrix.set(r, c, 22);
      }
    }
  }
  return matrix;
}

function ctxFromImage(image) {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  return canvas;
}
