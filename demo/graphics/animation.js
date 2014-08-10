'use strict';

var compo = require('compo'),
    Graphic = require('./graphic'),
    Clip = require('./clip'),
    Rect = require('../data/rect');

var Animation = compo.extend(Graphic, function(options) {
  this.clip = new Clip({
    position: options.position,
    url: options.url,
    direction: options.direction,
    offset: options.offset,
    crop: options.crop,
    numFrames: options.numFrames,
    midpoint: options.frameMidpoint,
    frameTime: options.frameTime
  });
});

Animation.prototype.render = function(scale, delta) {
  this.clip.render(scale, delta);
};

Animation.prototype.sprites = function() {
  return [this.clip.sprite];
};

module.exports = Animation;

