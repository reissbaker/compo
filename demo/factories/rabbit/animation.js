'use strict';

var Point = require('../../data/point'),
    Rect = require('../../data/rect'),
    TileGraphic = require('../../graphics/tile-graphic'),
    Animation = require('../../graphics/animation');

var url = '/assets/allenemiessheet.png';

module.exports = function(engine, entity, data) {
  var graphics = new Animation({
    position: data.loc,
    direction: data.dir,
    url: url,
    width: 24,
    height: 24,
    frameTime: 100,
    frameMidpoint: new Point(12, 12),
    crop: new Rect(0, 0, 168, 192)
  });

  graphics.defineLoop(exports.STAND, [2]);
  graphics.defineLoop(exports.DIE, [4, 5]);
  graphics.defineLoop(exports.HOP, [3, 3]);

  graphics.playLoop(exports.STAND);

  engine.renderer.table.attach(entity, graphics);

  return graphics;
};

exports.STAND = 'stand';
exports.DIE = 'die';
exports.HOP = 'hop';
