'use strict';

var compo = require('compo'),
    Graphic = require('./graphic'),
    Frame = require('./frame'),
    Point = require('../data/point'),
    Rect = require('../data/rect');

var GridGraphic = compo.extend(Graphic, function(args) {
  var position = args.position,
      url = args.url,
      matrix = args.matrix,
      tileSize = args.tileSize,
      spacing = args.spacing || 0,
      crop = args.crop,
      cols = (crop.width + spacing) / (tileSize.x + spacing),
      rows = (crop.height + spacing) / (tileSize.y + spacing);

  var x, y, r, c, curr, col, row;

  this.frames = [];
  for(r = 0; r < matrix.numRows; r++) {
    for(c = 0; c < matrix.numCols; c++) {
      curr = matrix.get(r, c);
      col = curr % cols;
      row = (curr / cols) | 0;

      x = col * tileSize.x + col * spacing;
      y = row * tileSize.y + row * spacing;

      if(curr >= 0) {
        this.frames.push(new Frame(position, url, {
          offset: new Point(c * tileSize.x, r * tileSize.y),
          crop: new Rect(x, y, tileSize.x, tileSize.y)
        }));
      }
    }
  }
});


Graphic.prototype.render =  function(scale) {
  for(var i = 0, l = this.frames.length; i < l; i++) {
    this.frames[i].render(scale);
  }
};

Graphic.prototype.sprites = function() {
  return this.frames.map(function(f) { return f.sprite; });
};


module.exports = GridGraphic;
