'use strict';

var PIXI = window.PIXI,
    compo = require('compo'),
    Graphic = require('./graphic'),
    Frame = require('./frame');

var TileGraphic = compo.extend(Graphic, function(position, direction, url, slice, options) {
  options = options || {};
  this.frame = new Frame(position, url, {
    direction: direction,
    offset: options.offset,
    crop: slice,
    midpoint: options.midpoint
  });
});

TileGraphic.prototype.render = function(camera, scale) {
  this.frame.render(camera, scale);
};
TileGraphic.prototype.sprites = function() {
  return [this.frame.sprite];
};

module.exports = TileGraphic;
