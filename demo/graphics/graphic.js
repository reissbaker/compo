'use strict';

var compo = require('compo');

var Graphic = compo.extend(compo.Component, function() { });

Graphic.prototype.sprites = function() {
  throw 'unimplemented';
};

module.exports = Graphic;
