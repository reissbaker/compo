!function(exports) {
  'use strict';

  function Raster(fr, image, textureId, x, y, w, h) {
    this._fr = fr;
    this._image = image;
    this._id = textureId;

    this.clipX = x;
    this.clipY = y;
    this.clipW = w;
    this.clipH = h;

    this.x = this.y = this.z;
    this.angle = 0;
    this.scale = 1;
  }

  Raster.prototype.render = function(x, y, z, mask) {};

  // Actually does the rendering. Overridable.
  Raster.prototype.shade = function(gl, prog, tex, mask) {
  };

  exports.Raster = Raster;

}(demo);
