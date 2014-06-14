'use strict';

var compo = require('compo'),
    Graphic = require('./graphic'),
    Frame = require('./frame'),
    Point = require('../data/point'),
    Rect = require('../data/rect');

var GridGraphic = compo.extend(Graphic, function(position, url, matrix, tileSize) {
  var r, c, curr;

  this.frames = [];
  for(r = 0; r < matrix.numRows; r++) {
    for(c = 0; c < matrix.numCols; c++) {
      curr = matrix.get(r, c);
      if(curr >= 0) {
        this.frames.push(new Frame(position, url, {
          offset: new Point(c * tileSize.x, r * tileSize.y),
          crop: new Rect(
            curr * tileSize.x,
            0,
            tileSize.x,
            tileSize.y
          )
        }));
      }
    }
  }
});


Graphic.prototype.render =  function() {
  for(var i = 0, l = this.frames.length; i < l; i++) {
    this.frames[i].render();
  }
};

Graphic.prototype.sprites = function() {
  return this.frames.map(function(f) { return f.sprite; });
};


module.exports = GridGraphic;
