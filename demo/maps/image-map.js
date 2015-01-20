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
  return isColor(pixel, 0, 0, 0);
}

function isNpcSpawnPoint(pixel) {
  return isColor(pixel, 0, 255, 0);
}

function isPlayerSpawnPoint(pixel) {
  return isColor(pixel, 0, 0, 255);
}

function isColor(pixel, r, g, b, a) {
  if(typeof a === 'undefined') a = 255;

  return pixel[0] === r && pixel[1] === g && pixel[2] === b && pixel[3] === a;
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
