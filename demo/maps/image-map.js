'use strict';

var Matrix = require('../data/matrix'),
    Point = require('../data/point');

function ImageMap(args) {
  var image = args.image,
      tile = args.tile,
      tileWidth = tile.width,
      tileHeight = tile.height;

  var canvas = canvasFromImage(image);
  var ctx = canvas.getContext('2d');

  var matrix = new Matrix(canvas.height, canvas.width, -1);
  var npcSpawnPoints = [];
  var playerSpawnPoint = new Point;

  for(var r = 0; r < matrix.numRows; r++) {
    for(var c = 0; c < matrix.numCols; c++) {
      var x = tileWidth * c,
          y = tileHeight * r;
      var pixel = ctx.getImageData(c, r, 1, 1).data;
      if(isBlock(pixel)) {
        matrix.set(r, c, tile.value);
      } else if(isNpcSpawnPoint(pixel)) {
        npcSpawnPoints.push(new Point(x, y));
      } else if(isPlayerSpawnPoint(pixel)) {
        playerSpawnPoint.x = x;
        playerSpawnPoint.y = y;
      }
    }
  }

  this.levelMatrix = matrix;
  this.npcSpawnPoints = npcSpawnPoints;
  this.playerSpawnPoint = playerSpawnPoint;
}

function isBlock(pixel) {
  return pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 255;
}

function isNpcSpawnPoint(pixel) {
  return false;
}

function isPlayerSpawnPoint(pixel) {
  return false;
}


function canvasFromImage(image) {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  return canvas;
}

module.exports = ImageMap;
