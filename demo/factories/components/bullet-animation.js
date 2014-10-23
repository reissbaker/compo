'use strict';

var Point = require('../../data/point'),
    Rect = require('../../data/rect'),
    TileGraphic = require('../../graphics/tile-graphic'),
    Animation = require('../../graphics/animation');

var url = '/assets/projectiles-spaced.png',
    pointUrl = '/assets/point.png';

module.exports = function(engine, entity, data) {
  var graphics = new Animation({
    position: data.loc,
    direction: data.dir,
    url: url,
    width: 12,
    height: 12,
    frameTime: 100,
    frameMidpoint: new Point(6, 6),
    crop: new Rect(0, 0, 96, 36)
  });

  graphics.defineLoop(exports.FLASH, [2,2,2,3,3,3]);
  engine.renderer.table.attach(entity, graphics);

  graphics.playLoop(exports.FLASH);

  var pointGraphic = new TileGraphic(data.loc, data.dir, pointUrl, {
    x: 0, y: 0, width: 1, height: 1
  });

  engine.renderer.table.attach(entity, pointGraphic);
  return graphics;
};

exports.FLASH = 'flash';
