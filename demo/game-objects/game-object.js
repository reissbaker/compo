'use strict';

var Point = require('../data/point'),
    Rect = require('../data/rect'),
    Direction = require('../data/direction');

module.exports = function(entity, x, y, offX, offY, w, h) {
  this.entity = entity;
  this.loc = new Point(x, y);
  this.hitbox = new Rect(offX, offY, w, h);
  this.dir = new Direction(Direction.RIGHT);
};
