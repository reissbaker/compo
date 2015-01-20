'use strict';

var Point = require('../../data/point'),
    Rect = require('../../data/rect'),
    TileGraphic = require('../../graphics/tile-graphic'),
    Animation = require('../../graphics/animation');

var url = '/assets/astrosheet.png';

module.exports = function(engine, entity, data) {
  var graphics = new Animation({
    position: data.loc,
    direction: data.dir,
    url: url,
    width: 24,
    height: 24,
    frameTime: 100,
    frameMidpoint: new Point(12, 12),
    crop: new Rect(0, 0, 120, 120)
  });

  graphics.defineLoop(exports.STAND, [5]);
  graphics.defineLoop(exports.WALK, [0, 1, 2, 3]);
  graphics.defineLoop(exports.JUMP, [7]);
  graphics.defineLoop(exports.DRAW, [15]);
  graphics.defineLoop(exports.SHOOT, [16, 16, 17]);
  graphics.playLoop(exports.STAND);

  engine.renderer.table.attach(entity, graphics);

  return graphics;
};

exports.WALK = 'walk';
exports.STAND = 'stand';
exports.JUMP = 'jump';
exports.SHOOT = 'shoot';
exports.DRAW = 'draw';

