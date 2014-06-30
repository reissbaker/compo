'use strict';

var PIXI = window.PIXI,
    compo = require('compo'),
    Graphic = require('./graphic'),
    Frame = require('./frame');

var TileGraphic = compo.extend(Graphic, function(position, direction, url, slice, offset) {
  this.frame = new Frame(position, url, {
    direction: direction,
    offset: offset,
    crop: slice
  });
});

TileGraphic.prototype.render = function(scale) {
  this.frame.render(scale);
};
TileGraphic.prototype.sprites = function() {
  return [this.frame.sprite];
};

module.exports = TileGraphic;
