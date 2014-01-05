!function(seine, exports) {

  var Graphic = exports.Graphic,
      Frame = exports.Frame,
      Point = exports.Point,
      Rect =exports.Rect;

  exports.GridGraphic = Graphic.extend({
    init: function(position, url, matrix, tileSize) {
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
    },

    render: function() {
      for(var i = 0, l = this.frames.length; i < l; i++) {
        this.frames[i].render();
      }
    },

    sprites: function() {
      return this.frames.map(function(f) { return f.sprite; });
    }
  });


}(seine, demo);
